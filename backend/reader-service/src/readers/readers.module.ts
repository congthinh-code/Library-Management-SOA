
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { Reader } from './reader.entity';
import { ReadersController } from './readers.controller';
import { ReadersService } from './readers.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reader]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReadersController],
  providers: [ReadersService, JwtStrategy],
})
export class ReadersModule {}
