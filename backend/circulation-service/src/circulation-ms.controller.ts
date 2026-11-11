import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CirculationService } from './circulation.service';

@Controller()
export class CirculationMsController {
  constructor(private readonly circulationService: CirculationService) {}

  @MessagePattern({ cmd: 'create_loan' })
  async createLoan(@Payload() data: { readerId: string; bookCopyIds: string[]; daysToBorrow?: number }) {
    return this.circulationService.createLoan(data);
  }

  @MessagePattern({ cmd: 'return_loan' })
  async returnLoan(@Payload() data: { loanId: string }) {
    return this.circulationService.returnLoan(data.loanId);
  }
}