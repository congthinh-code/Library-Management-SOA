import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories/entities/category.entity';
import { Author } from './authors/entities/author.entity';
import { Book } from './books/entities/book.entity';
import { BookAuthor } from './book-authors/entities/book-author.entity';
import { BookCopy } from './book-copies/entities/book-copy.entity';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql' as const,
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        schema: configService.get<string>('DB_SCHEMA'),

        options: {
          encrypt: false,
          trustServerCertificate: true,
        },

        entities: [
  Category,
  Author,
  Book,
  BookAuthor,
  BookCopy,
],
        synchronize: false,
        logging: ['error'],
      }),
    }),

    CategoriesModule,
  ],
})
export class AppModule {}
