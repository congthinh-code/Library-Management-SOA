import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './circulation.controller';
import { CirculationService } from './circulation.service';
import { Loan } from './entities/loan.entity';
import { LoanDetail } from './entities/loan-detail.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || 'YourPassword123',
      database: process.env.DB_NAME || 'LibraryDB',
      entities: [Loan, LoanDetail, Reservation],
      synchronize: true, // Tự động tạo bảng loans, loan_details, reservations vào LibraryDB
      requestTimeout: 30000,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        packetSize: 4096,
        connectTimeout: 30000,
      },
    }),
    TypeOrmModule.forFeature([Loan, LoanDetail, Reservation]),
  ],
  controllers: [AppController],
  providers: [CirculationService],
})
export class AppModule {}