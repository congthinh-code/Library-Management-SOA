import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { DataSource, In, Repository } from 'typeorm';
import { CIRCULATION_RULES } from '../../common/constants/circulation.constants.js';
import {
  FineStatus,
  LoanDetailStatus,
  LoanStatus,
  ReservationStatus,
} from '../../common/enums/circulation.enum.js';
import {
  BookCopyInfo,
  CatalogClientService,
} from '../../integration/catalog-client.service.js';
import { ReaderClientService } from '../../integration/reader-client.service.js';
import { Fine } from '../fines/entities/fine.entity.js';
import { Reservation } from '../reservations/entities/reservation.entity.js';
import { CreateLoanDto } from './dto/create-loan.dto.js';
import {
  CreateLoanEnvelopeResponseDto,
  LoanResponseDto,
} from './dto/loan-response.dto.js';
import { LoanDetail } from './entities/loan-detail.entity.js';
import { Loan } from './entities/loan.entity.js';

interface IdempotencyRecord {
  expiresAt: number;
  response: CreateLoanEnvelopeResponseDto;
}

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);
  private readonly idempotencyCache = new Map<string, IdempotencyRecord>();

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(LoanDetail)
    private readonly loanDetailRepository: Repository<LoanDetail>,
    @InjectRepository(Fine)
    private readonly fineRepository: Repository<Fine>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly readerClient: ReaderClientService,
    private readonly catalogClient: CatalogClientService,
  ) {}

  async createLoan(
    dto: CreateLoanDto,
    idempotencyKey?: string,
    authHeader?: string,
  ): Promise<CreateLoanEnvelopeResponseDto> {
    // 0. Kiểm tra Idempotency-Key chống tạo giao dịch trùng khi client retry
    if (idempotencyKey) {
      this.cleanupExpiredIdempotencyKeys();
      const cached = this.idempotencyCache.get(idempotencyKey);
      if (cached && cached.expiresAt > Date.now()) {
        this.logger.log(
          `Trả về kết quả đã xử lý trước đó cho Idempotency-Key: ${idempotencyKey}`,
        );
        return cached.response;
      }
    }

    const now = new Date();
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : this.calculateDefaultDueDate(now);

    if (dueDate <= now) {
      throw new BadRequestException(
        'Ngày hẹn trả (dueDate) phải lớn hơn thời điểm mượn hiện tại.',
      );
    }

    // 1. Kiểm tra độc giả và trạng thái thẻ qua Reader Service
    await this.readerClient.validateReaderForBorrowing(dto.readerId, authHeader);

    // 2. Kiểm tra điều kiện mượn nội bộ trong schema circulation:
    // - Chặn mượn nếu có sách quá hạn
    // - Chặn mượn nếu đang nợ tiền phạt
    // - Tổng số sách đang mượn + sách mới không vượt quá 5 cuốn
    await this.validateReaderCirculationEligibility(dto.readerId, dto.items.length, now);

    // 3. Kiểm tra từng bản sao sách qua Catalog Service & trạng thái đang mượn nội bộ
    const copyIds = dto.items.map((item) => item.bookCopyId);
    const activeBorrowedCopies = await this.loanDetailRepository.find({
      where: {
        bookCopyId: In(copyIds),
        status: In([LoanDetailStatus.BORROWED, LoanDetailStatus.OVERDUE]),
      },
    });

    if (activeBorrowedCopies.length > 0) {
      const busyIds = activeBorrowedCopies.map((c) => c.bookCopyId).join(', ');
      throw new ConflictException(
        `Các bản sao sách sau đang được mượn trên hệ thống: [${busyIds}].`,
      );
    }

    const verifiedCopies = new Map<string, BookCopyInfo>();
    for (const item of dto.items) {
      const copyInfo = await this.catalogClient.getAndValidateCopy(
        item.bookCopyId,
        authHeader,
      );
      verifiedCopies.set(item.bookCopyId, copyInfo);
    }

    // 4. Thực thi lưu Database trong Transaction SQL + Cập nhật Catalog Service có Bù trừ (Saga)
    const confirmedCatalogCopyIds: string[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Nếu mượn từ phiếu đặt trước, kiểm tra và cập nhật trạng thái phiếu đặt trước
      if (dto.reservationId) {
        const reservation = await queryRunner.manager.findOne(Reservation, {
          where: { id: dto.reservationId },
        });
        if (!reservation) {
          throw new BadRequestException(
            `Không tìm thấy phiếu đặt trước ID = ${dto.reservationId}.`,
          );
        }
        if (reservation.readerId !== dto.readerId) {
          throw new BadRequestException(
            'Phiếu đặt trước không thuộc về độc giả này.',
          );
        }
        if (
          ![
            ReservationStatus.PENDING,
            ReservationStatus.READY_FOR_PICKUP,
          ].includes(reservation.status)
        ) {
          throw new ConflictException(
            `Phiếu đặt trước đang ở trạng thái [${reservation.status}], không thể chuyển thành phiếu mượn.`,
          );
        }

        reservation.status = ReservationStatus.FULFILLED;
        reservation.fulfilledAt = now;
        await queryRunner.manager.save(Reservation, reservation);
      }

      // Tạo phiếu mượn (Loan)
      const loan = queryRunner.manager.create(Loan, {
        loanCode: this.generateLoanCode(now),
        readerId: dto.readerId,
        reservationId: dto.reservationId ?? null,
        staffId: dto.staffId ?? null,
        borrowDate: now,
        dueDate,
        status: LoanStatus.BORROWED,
        notes: dto.notes ?? null,
      });

      const savedLoan = await queryRunner.manager.save(Loan, loan);

      // Tạo chi tiết từng cuốn sách mượn (LoanDetail)
      const detailEntities = dto.items.map((item) => {
        const copyInfo = verifiedCopies.get(item.bookCopyId)!;
        return queryRunner.manager.create(LoanDetail, {
          loanId: savedLoan.id,
          bookId: String(copyInfo.bookId),
          bookCopyId: String(item.bookCopyId),
          dueDate,
          returnDate: null,
          renewalCount: 0,
          returnCondition: null,
          status: LoanDetailStatus.BORROWED,
          notes: item.notes ?? null,
        });
      });

      const savedDetails = await queryRunner.manager.save(
        LoanDetail,
        detailEntities,
      );

      // Gọi Catalog Service xác nhận chuyển trạng thái từng bản sao sang BORROWED
      for (const item of dto.items) {
        await this.catalogClient.updateCopyStatus(
          item.bookCopyId,
          'BORROWED',
          authHeader,
        );
        confirmedCatalogCopyIds.push(item.bookCopyId);
      }

      // Commit Transaction SQL Server
      await queryRunner.commitTransaction();

      const response: CreateLoanEnvelopeResponseDto = {
        data: this.mapToResponseDto(savedLoan, savedDetails),
        message: 'Tạo phiếu mượn sách thành công',
      };

      if (idempotencyKey) {
        this.idempotencyCache.set(idempotencyKey, {
          expiresAt: Date.now() + CIRCULATION_RULES.IDEMPOTENCY_TTL_MS,
          response,
        });
      }

      return response;
    } catch (error) {
      // 1. Rollback Transaction trong SQL Server
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      // 2. Bù trừ (Compensating Action): Trả lại trạng thái AVAILABLE cho các bản sao đã cập nhật trên Catalog Service
      if (confirmedCatalogCopyIds.length > 0) {
        this.logger.warn(
          `Giao dịch tạo phiếu mượn thất bại. Tiến hành bù trừ trạng thái AVAILABLE trên Catalog Service cho: [${confirmedCatalogCopyIds.join(', ')}]`,
        );
        for (const copyId of confirmedCatalogCopyIds) {
          try {
            await this.catalogClient.updateCopyStatus(
              copyId,
              'AVAILABLE',
              authHeader,
            );
          } catch (rollbackErr) {
            this.logger.error(
              `[CRITICAL] Bù trừ thất bại cho bookCopyId=${copyId}. Cần đối soát thủ công!`,
              rollbackErr instanceof Error ? rollbackErr.stack : String(rollbackErr),
            );
          }
        }
      }

      // Xử lý lỗi trùng lặp Filtered Unique Index từ SQL Server (Mã lỗi 2601 / 2627)
      const dbError = error as { number?: number; message?: string };
      if (dbError.number === 2601 || dbError.number === 2627) {
        throw new ConflictException(
          'Một trong các bản sao sách vừa được độc giả khác mượn. Vui lòng kiểm tra lại.',
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async validateReaderCirculationEligibility(
    readerId: number,
    requestedBooksCount: number,
    now: Date,
  ): Promise<void> {
    // 1. Kiểm tra nợ tiền phạt chưa thanh toán
    const unpaidFinesCount = await this.fineRepository.count({
      where: {
        readerId,
        status: In([FineStatus.UNPAID, FineStatus.PARTIALLY_PAID]),
      },
    });

    if (unpaidFinesCount > 0) {
      throw new UnprocessableEntityException(
        `Độc giả (ID: ${readerId}) đang có ${unpaidFinesCount} khoản tiền phạt chưa thanh toán. Vui lòng hoàn tất thanh toán trước khi mượn sách mới.`,
      );
    }

    // 2. Lấy toàn bộ sách đang mượn của độc giả
    const activeLoanDetails = await this.loanDetailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.loan', 'loan')
      .where('loan.readerId = :readerId', { readerId })
      .andWhere('detail.status IN (:...statuses)', {
        statuses: [LoanDetailStatus.BORROWED, LoanDetailStatus.OVERDUE],
      })
      .getMany();

    // 3. Kiểm tra xem có cuốn nào đã quá hạn hay không
    const hasOverdueBooks = activeLoanDetails.some(
      (detail) =>
        detail.status === LoanDetailStatus.OVERDUE ||
        new Date(detail.dueDate) < now,
    );

    if (hasOverdueBooks) {
      throw new UnprocessableEntityException(
        `Độc giả (ID: ${readerId}) đang có sách mượn quá hạn chưa trả. Không thể tạo phiếu mượn mới.`,
      );
    }

    // 4. Kiểm tra tổng số lượng sách mượn tối đa 5 cuốn
    const currentBorrowedCount = activeLoanDetails.length;
    if (
      currentBorrowedCount + requestedBooksCount >
      CIRCULATION_RULES.MAX_ACTIVE_BOOKS_PER_READER
    ) {
      throw new UnprocessableEntityException(
        `Độc giả đang mượn ${currentBorrowedCount} cuốn, yêu cầu mượn thêm ${requestedBooksCount} cuốn sẽ vượt quá giới hạn tối đa ${CIRCULATION_RULES.MAX_ACTIVE_BOOKS_PER_READER} cuốn.`,
      );
    }
  }

  private calculateDefaultDueDate(borrowDate: Date): Date {
    const due = new Date(borrowDate);
    due.setDate(due.getDate() + CIRCULATION_RULES.DEFAULT_LOAN_DAYS);
    return due;
  }

  private generateLoanCode(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const rand = String(randomInt(100000, 999999));
    return `LN-${yyyy}${mm}${dd}-${rand}`;
  }

  private cleanupExpiredIdempotencyKeys(): void {
    const now = Date.now();
    for (const [key, record] of this.idempotencyCache.entries()) {
      if (record.expiresAt <= now) {
        this.idempotencyCache.delete(key);
      }
    }
  }

  private mapToResponseDto(
    loan: Loan,
    details: LoanDetail[],
  ): LoanResponseDto {
    return {
      id: loan.id,
      loanCode: loan.loanCode,
      readerId: loan.readerId,
      reservationId: loan.reservationId,
      staffId: loan.staffId,
      borrowDate: loan.borrowDate,
      dueDate: loan.dueDate,
      status: loan.status,
      notes: loan.notes,
      details: details.map((d) => ({
        id: d.id,
        bookId: d.bookId,
        bookCopyId: d.bookCopyId,
        dueDate: d.dueDate,
        returnDate: d.returnDate,
        renewalCount: d.renewalCount,
        returnCondition: d.returnCondition,
        status: d.status,
        notes: d.notes,
      })),
      createdAt: loan.createdAt,
    };
  }
}