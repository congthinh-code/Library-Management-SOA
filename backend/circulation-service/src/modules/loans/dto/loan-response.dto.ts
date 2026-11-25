import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  LoanDetailStatus,
  LoanStatus,
  ReturnCondition,
} from '../../../common/enums/circulation.enum.js';

export class LoanDetailResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: '10' })
  bookId: string;

  @ApiProperty({ example: '1001' })
  bookCopyId: string;

  @ApiProperty({ example: '2026-12-09T09:18:00.000Z' })
  dueDate: Date;

  @ApiPropertyOptional({ example: null })
  returnDate: Date | null;

  @ApiProperty({ example: 0 })
  renewalCount: number;

  @ApiPropertyOptional({ enum: ReturnCondition, example: null })
  returnCondition: ReturnCondition | null;

  @ApiProperty({ enum: LoanDetailStatus, example: LoanDetailStatus.BORROWED })
  status: LoanDetailStatus;

  @ApiPropertyOptional({ example: null })
  notes: string | null;
}

export class LoanResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'LN-20261125-849201' })
  loanCode: string;

  @ApiProperty({ example: 1 })
  readerId: number;

  @ApiPropertyOptional({ example: null })
  reservationId: string | null;

  @ApiPropertyOptional({ example: 2 })
  staffId: number | null;

  @ApiProperty({ example: '2026-11-25T09:18:00.000Z' })
  borrowDate: Date;

  @ApiProperty({ example: '2026-12-09T09:18:00.000Z' })
  dueDate: Date;

  @ApiProperty({ enum: LoanStatus, example: LoanStatus.BORROWED })
  status: LoanStatus;

  @ApiPropertyOptional({ example: 'Độc giả mượn tại quầy' })
  notes: string | null;

  @ApiProperty({ type: [LoanDetailResponseDto] })
  details: LoanDetailResponseDto[];

  @ApiProperty({ example: '2026-11-25T09:18:00.000Z' })
  createdAt: Date;
}

export class CreateLoanEnvelopeResponseDto {
  @ApiProperty({ type: LoanResponseDto })
  data: LoanResponseDto;

  @ApiProperty({ example: 'Tạo phiếu mượn sách thành công' })
  message: string;
}