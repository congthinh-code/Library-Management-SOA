import { Controller, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('circulation')
export class CirculationController {
  constructor(
    @Inject('CIRCULATION_SERVICE') private readonly circulationClient: ClientProxy,
  ) {}

  @Post('loans')
  createLoan(@Body() createLoanDto: any) {
    // Forward request sang Circulation Service
    return this.circulationClient.send({ cmd: 'create_loan' }, createLoanDto);
  }

  @Post('loans/:id/return')
  returnLoan(@Param('id') loanId: string) {
    return this.circulationClient.send({ cmd: 'return_loan' }, { loanId });
  }
}