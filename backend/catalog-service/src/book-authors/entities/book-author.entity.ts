
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Book } from '../../books/entities/book.entity';
import { Author } from '../../authors/entities/author.entity';

@Entity({ name: 'book_authors', schema: 'catalog' })
export class BookAuthor {
  @PrimaryColumn({ type: 'bigint', name: 'book_id' })
  book_id: string;

  @PrimaryColumn({ type: 'bigint', name: 'author_id' })
  author_id: string;

  @ManyToOne(() => Book, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id', referencedColumnName: 'book_id' })
  book: Book;

  @ManyToOne(() => Author, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'author_id' })
  author: Author;
}
