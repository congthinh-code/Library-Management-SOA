import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationModule } from '../../integration/integration.module.js';
import { Fine } from '../fines/entities/fine.entity.js';
import { Reservation } from '../reservations/entities/reservation.entity.js';
import { LoanDetail } from './entities/loan-detail.entity.js';
import { Loan } from './entities/loan.entity.js';
import { LoansController } from './loans.controller.js';
import { LoansService } from './loans.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, LoanDetail, Fine, Reservation]),
    IntegrationModule,
  ],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}