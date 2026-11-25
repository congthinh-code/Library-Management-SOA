import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CirculationController } from './controller/circulation.controller'; // Import controller của bạn

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CIRCULATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.CIRCULATION_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.CIRCULATION_SERVICE_PORT) || 3004,
        },
      },
    ]),
  ],
  controllers: [AppController, CirculationController], // Bổ sung CirculationController ở đây
  providers: [AppService],
})
export class AppModule {}