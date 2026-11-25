import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CIRCULATION_RULES } from '../../../common/constants/circulation.constants.js';

export class CreateLoanItemDto {
  @ApiProperty({
    description: 'ID bản sao sách vật lý từ Catalog Service (BIGINT)',
    example: '1001',
  })
  @IsNotEmpty({ message: 'bookCopyId không được để trống' })
  @IsNumberString({}, { message: 'bookCopyId phải là chuỗi số hợp lệ' })
  bookCopyId: string;

  @ApiPropertyOptional({
    description: 'Ghi chú tình trạng riêng cho cuốn sách khi mượn',
    example: 'Bìa hơi sờn góc dưới',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class CreateLoanDto {
  @ApiProperty({
    description: 'ID độc giả từ Reader Service (INT)',
    example: 1,
  })
  @IsNotEmpty({ message: 'readerId không được để trống' })
  @IsInt({ message: 'readerId phải là số nguyên' })
  @IsPositive({ message: 'readerId phải lớn hơn 0' })
  readerId: number;

  @ApiPropertyOptional({
    description: 'ID phiếu đặt trước (nếu mượn từ yêu cầu đặt trước)',
    example: '12',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'reservationId phải là chuỗi số hợp lệ' })
  reservationId?: string;

  @ApiPropertyOptional({
    description: 'ID thủ thư lập phiếu từ Auth Service (INT)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  staffId?: number;

  @ApiPropertyOptional({
    description:
      'Ngày hẹn trả (ISO 8601). Nếu bỏ trống hệ thống tự tính mặc định +14 ngày.',
    example: '2026-12-09T17:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'dueDate phải đúng định dạng ngày ISO 8601' })
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú chung cho phiếu mượn',
    example: 'Độc giả mượn phục vụ đồ án tốt nghiệp',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: `Danh sách bản sao sách mượn (tối thiểu 1, tối đa ${CIRCULATION_RULES.MAX_ACTIVE_BOOKS_PER_READER} cuốn)`,
    type: [CreateLoanItemDto],
  })
  @IsArray({ message: 'items phải là một mảng danh sách sách mượn' })
  @ArrayMinSize(1, { message: 'Phiếu mượn phải có ít nhất 1 cuốn sách' })
  @ArrayMaxSize(CIRCULATION_RULES.MAX_ACTIVE_BOOKS_PER_READER, {
    message: `Mỗi lần chỉ được mượn tối đa ${CIRCULATION_RULES.MAX_ACTIVE_BOOKS_PER_READER} cuốn sách`,
  })
  @ArrayUnique((item: CreateLoanItemDto) => item.bookCopyId, {
    message: 'Danh sách sách mượn có chứa bookCopyId bị trùng lặp',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateLoanItemDto)
  items: CreateLoanItemDto[];
}