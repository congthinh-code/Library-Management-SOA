import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Category } from './categories/entities/category.entity';
import { Author } from './authors/entities/author.entity';
import { Book } from './books/entities/book.entity';
import { BookAuthor } from './book-authors/entities/book-author.entity';
import { BookCopy } from './book-copies/entities/book-copy.entity';

// Đọc biến môi trường từ file .env
process.loadEnvFile();

const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  entities: [Category, Author, Book, BookAuthor, BookCopy],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
  logging: ['error'],
});

export default AppDataSource;