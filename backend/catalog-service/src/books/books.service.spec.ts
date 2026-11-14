
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateBookDto } from './dto/create-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let manager: any;
  let bookRepository: any;
  let queryBuilder: any;

  const category = {
    category_id: '1',
    name: 'Science',
  };

  const savedBook = {
    book_id: '10',
    title: 'Test Book',
    isbn: '9786041234568',
    description: 'Test description',
    publisher: 'NXB Tre',
    published_year: 2024,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    manager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((_entity, value) => value),
      save: jest.fn(),
    };

    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    bookRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    const dataSourceMock = {
      transaction: jest.fn((callback) => callback(manager)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: bookRepository,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateBookDto = {
      title: 'Test Book',
      isbn: '9786041234568',
      description: 'Test description',
      publisher: 'NXB Tre',
      publishedYear: 2024,
      categoryId: '1',
    };

    it('should create a book successfully', async () => {
      manager.findOne.mockResolvedValue(category);
      manager.find.mockResolvedValue([]);
      manager.save.mockResolvedValue(savedBook);

      const result = await service.create(dto);

      expect(result.data.id).toBe('10');
      expect(result.data.title).toBe('Test Book');
      expect(result.data.categoryId).toBe('1');
      expect(result.message).toBe('Book created successfully');
    });

    it('should throw NotFoundException when category does not exist', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    const sampleBook = {
      book_id: '10',
      title: 'Test Book',
      isbn: '9786041234568',
      description: 'Test description',
      publisher: 'NXB Tre',
      published_year: 2024,
      category,
    };

    it('should return a paginated list of books', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[sampleBook], 1]);

      const result = await service.findAll(1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Book');
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should search books by keyword', async () => {
      queryBuilder.getManyAndCount.mockResolvedValue([[sampleBook], 1]);

      await service.findAll(1, 20, 'Test');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        expect.any(String),
        { search: '%Test%' },
      );
    });

    it('should throw BadRequestException when page is invalid', async () => {
      await expect(service.findAll(0, 20)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when limit exceeds 100', async () => {
      await expect(service.findAll(1, 101)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
