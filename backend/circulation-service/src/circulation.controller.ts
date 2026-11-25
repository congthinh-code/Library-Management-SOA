import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CirculationService } from './circulation.service';

@Controller()
export class AppController {
  constructor(private readonly circulationService: CirculationService) {}

  @MessagePattern({ cmd: 'create_loan' })
  async createLoan(
    @Payload() dto: { readerId: string; bookCopyIds: string[]; daysToBorrow?: number },
  ) {
    return await this.circulationService.createLoan(dto);
  }

  @MessagePattern({ cmd: 'return_loan' })
  async returnLoan(@Payload() data: { loanId: string }) {
    return await this.circulationService.returnLoan(data.loanId);
  }
}