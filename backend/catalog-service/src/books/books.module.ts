
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Book } from './entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { Author } from '../authors/entities/author.entity';
import { BookAuthor } from '../book-authors/entities/book-author.entity';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      Category,
      Author,
      BookAuthor,
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
