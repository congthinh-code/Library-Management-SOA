import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateLoanDto } from './dto/create-loan.dto.js';
import { CreateLoanEnvelopeResponseDto } from './dto/loan-response.dto.js';
import { LoansService } from './loans.service.js';

@ApiTags('Loans (Mượn / Trả sách)')
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo phiếu mượn sách mới',
    description:
      'Kiểm tra độc giả (Reader Service), kiểm tra điều kiện mượn (tối đa 5 cuốn, không quá hạn, không nợ phạt), kiểm tra và xác nhận bản sao sách (Catalog Service), tạo phiếu mượn kèm chi tiết.',
  })
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description: 'Mã định danh duy nhất của request (UUID) để tránh tạo trùng phiếu mượn khi mạng lỗi/retry',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo phiếu mượn sách thành công',
    type: CreateLoanEnvelopeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ hoặc thẻ độc giả không hoạt động' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy độc giả hoặc bản sao sách' })
  @ApiResponse({ status: 409, description: 'Bản sao sách không ở trạng thái AVAILABLE hoặc đang được mượn' })
  @ApiResponse({ status: 422, description: 'Vi phạm quy tắc nghiệp vụ (quá 5 cuốn, đang quá hạn hoặc nợ tiền phạt)' })
  async createLoanHttp(
    @Body() createLoanDto: CreateLoanDto,
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<CreateLoanEnvelopeResponseDto> {
    return this.loansService.createLoan(
      createLoanDto,
      idempotencyKey,
      authHeader,
    );
  }

  // Hỗ trợ API Gateway gọi xuống thông qua TCP Microservice
  @MessagePattern({ cmd: 'create_loan' })
  async createLoanTcp(
    @Payload()
    payload: CreateLoanDto & {
      idempotencyKey?: string;
      authorization?: string;
    },
  ): Promise<CreateLoanEnvelopeResponseDto> {
    const { idempotencyKey, authorization, ...dto } = payload;
    return this.loansService.createLoan(dto, idempotencyKey, authorization);
  }
}