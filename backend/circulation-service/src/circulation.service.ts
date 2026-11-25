import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Loan, LoanStatus } from './entities/loan.entity';
import { LoanDetail } from './entities/loan-detail.entity';
import { Reservation, ReservationStatus } from './entities/reservation.entity';

@Injectable()
export class CirculationService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepo: Repository<Loan>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly dataSource: DataSource,
  ) {}

  async createLoan(dto: { readerId: string; bookCopyIds: string[]; daysToBorrow?: number }) {
    if (!dto.bookCopyIds || dto.bookCopyIds.length === 0) {
      throw new BadRequestException('Danh sách bookCopyIds không được để trống');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(borrowDate.getDate() + (dto.daysToBorrow || 14));

      // 1. Khởi tạo đối tượng Loan
      const loan = new Loan();
      loan.readerId = dto.readerId;
      loan.borrowDate = borrowDate;
      loan.dueDate = dueDate;
      loan.status = LoanStatus.BORROWED;

      // 2. Tạo danh sách LoanDetail và liên kết với Loan
      loan.details = dto.bookCopyIds.map((copyId) => {
        const detail = new LoanDetail();
        detail.bookCopyId = copyId;
        return detail;
      });

      // 3. Lưu Loan (Cascade sẽ tự động chèn dữ liệu vào bảng loan_details)
      const savedLoan = await queryRunner.manager.save(Loan, loan);

      // 4. Cập nhật các đơn đặt giữ (Reservation) nếu có
      for (const copyId of dto.bookCopyIds) {
        const reservation = await queryRunner.manager.findOne(Reservation, {
          where: { readerId: dto.readerId, bookCopyId: copyId, status: ReservationStatus.PENDING },
        });

        if (reservation) {
          reservation.status = ReservationStatus.FULFILLED;
          await queryRunner.manager.save(Reservation, reservation);
        }
      }

      await queryRunner.commitTransaction();
      return savedLoan;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async returnLoan(loanId: string) {
    const loan = await this.loanRepo.findOne({
      where: { id: loanId },
      relations: {
          details: true,
      },
    });

    if (!loan) {
      throw new NotFoundException('Không tìm thấy phiếu mượn');
    }

    if (loan.status === LoanStatus.RETURNED) {
      throw new BadRequestException('Phiếu mượn này đã được trả trước đó');
    }

    loan.status = LoanStatus.RETURNED;
    loan.actualReturnDate = new Date();

    return await this.loanRepo.save(loan);
  }
}