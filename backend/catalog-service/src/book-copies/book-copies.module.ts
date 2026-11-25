import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCopy } from './entities/book-copy.entity';
import { BookCopiesController } from './book-copies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookCopy])],
  controllers: [BookCopiesController],
})
export class BookCopiesModule {}