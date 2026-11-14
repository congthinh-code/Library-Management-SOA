import {Injectable, BadRequestException, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { Book } from './entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { Author } from '../authors/entities/author.entity';
import { BookAuthor } from '../book-authors/entities/book-author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const {
      title,
      isbn,
      description,
      publisher,
      publishedYear,
      categoryId,
      authorIds,
    } = createBookDto;

    return this.dataSource.transaction(async (manager) => {
      // Kiểm tra danh mục có tồn tại không
      const category = await manager.findOne(Category, {
        where: { category_id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      // Kiểm tra các tác giả
      const uniqueAuthorIds = [...new Set(authorIds ?? [])];

      const authors = uniqueAuthorIds.length
        ? await manager.find(Author, {
            where: { author_id: In(uniqueAuthorIds) },
          })
        : [];

      if (authors.length !== uniqueAuthorIds.length) {
        throw new BadRequestException(
          'Một hoặc nhiều tác giả không tồn tại',
        );
      }

      // Tạo sách
      const book = manager.create(Book, {
        title,
        isbn: isbn ?? null,
        description: description ?? null,
        publisher: publisher ?? null,
        published_year: publishedYear ?? null,
        category,
      });

      const savedBook = await manager.save(Book, book);

      // Lưu quan hệ sách - tác giả
      if (authors.length > 0) {
        const bookAuthors = authors.map((author) =>
          manager.create(BookAuthor, {
            book_id: savedBook.book_id,
            author_id: author.author_id,
          }),
        );

        await manager.save(BookAuthor, bookAuthors);
      }

      return {
        data: {
          id: savedBook.book_id,
          title: savedBook.title,
          isbn: savedBook.isbn,
          description: savedBook.description,
          publisher: savedBook.publisher,
          publishedYear: savedBook.published_year,
          categoryId: category.category_id,
          authorIds: authors.map((author) => author.author_id),
          createdAt: savedBook.created_at,
          updatedAt: savedBook.updated_at,
        },
        message: 'Book created successfully',
      };
    });
  }


  async findAll(page = 1, limit = 20, search?: string) {
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException(
        'page phải là số nguyên lớn hơn hoặc bằng 1',
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'limit phải nằm trong khoảng từ 1 đến 100',
      );
    }

    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoin(
        BookAuthor,
        'bookAuthor',
        'bookAuthor.book_id = book.book_id',
        )
        .leftJoin(
        Author,
        'author',
        'author.author_id = bookAuthor.author_id',
        );

    if (search?.trim()) {
      query.andWhere(
        '(book.title LIKE :search OR book.isbn LIKE :search OR author.name LIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    const [books, total] = await query
      .orderBy('book.book_id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: books.map((book) => ({
        id: book.book_id,
        title: book.title,
        isbn: book.isbn,
        description: book.description,
        publisher: book.publisher,
        publishedYear: book.published_year,
        category: book.category
          ? {
              id: book.category.category_id,
              name: book.category.name,
            }
          : null,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

    async findOne(id: string) {
    if (!/^[1-9]\d*$/.test(id)) {
        throw new BadRequestException('ID sách không hợp lệ');
    }

    const book = await this.bookRepository.findOne({
        where: { book_id: id },
        relations: {
        category: true,
        },
    });

    if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
    }

    const bookAuthors = await this.dataSource
        .getRepository(BookAuthor)
        .find({
        where: { book_id: id },
        });

    return {
        data: {
        id: book.book_id,
        title: book.title,
        isbn: book.isbn,
        description: book.description,
        publisher: book.publisher,
        publishedYear: book.published_year,
        category: book.category
            ? {
                id: book.category.category_id,
                name: book.category.name,
            }
            : null,
        authorIds: bookAuthors.map((item) => item.author_id),
        createdAt: book.created_at,
        updatedAt: book.updated_at,
        },
        message: 'Success',
    };
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
    if (!/^[1-9]\d*$/.test(id)) {
        throw new BadRequestException('ID sách không hợp lệ');
    }

    return this.dataSource.transaction(async (manager) => {
        const book = await manager.findOne(Book, {
        where: { book_id: id },
        });

        if (!book) {
        throw new NotFoundException('Không tìm thấy sách');
        }

        const {
        title,
        isbn,
        description,
        publisher,
        publishedYear,
        categoryId,
        authorIds,
        } = updateBookDto;

        if (title !== undefined) book.title = title;
        if (isbn !== undefined) book.isbn = isbn;
        if (description !== undefined) book.description = description;
        if (publisher !== undefined) book.publisher = publisher;
        if (publishedYear !== undefined) {
        book.published_year = publishedYear;
        }

        if (categoryId !== undefined) {
        const category = await manager.findOne(Category, {
            where: { category_id: categoryId },
        });

        if (!category) {
            throw new NotFoundException('Danh mục không tồn tại');
        }

        book.category = category;
        }

        await manager.save(Book, book);

        if (authorIds !== undefined) {
        const uniqueAuthorIds = [...new Set(authorIds)];

        const authors = uniqueAuthorIds.length
            ? await manager.find(Author, {
                where: { author_id: In(uniqueAuthorIds) },
            })
            : [];

        if (authors.length !== uniqueAuthorIds.length) {
            throw new BadRequestException(
            'Một hoặc nhiều tác giả không tồn tại',
            );
        }

        await manager.delete(BookAuthor, {
            book_id: id,
        });

        if (authors.length > 0) {
            const bookAuthors = authors.map((author) =>
            manager.create(BookAuthor, {
                book_id: id,
                author_id: author.author_id,
            }),
            );

            await manager.save(BookAuthor, bookAuthors);
        }
        }

        return {
        message: 'Book updated successfully',
        };
    });
    }

    async remove(id: string) {
  if (!/^[1-9]\d*$/.test(id)) {
    throw new BadRequestException('ID sách không hợp lệ');
  }

  const book = await this.bookRepository.findOne({
    where: { book_id: id },
  });

  if (!book) {
    throw new NotFoundException('Không tìm thấy sách');
  }

  const copyCount = await this.dataSource
    .getRepository(BookCopy)
    .count({
      where: { book: { book_id: id } },
    });

  if (copyCount > 0) {
    throw new ConflictException(
  'Không thể xóa sách vì sách vẫn còn bản sao trong thư viện',
);
  }

  await this.bookRepository.remove(book);

  return {
    message: 'Book deleted successfully',
  };
}
}
