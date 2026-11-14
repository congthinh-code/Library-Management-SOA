import {Injectable, ConflictException, BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
    sortBy = 'name',
    sortOrder = 'asc',
  ) {
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page phải là số nguyên lớn hơn hoặc bằng 1');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('limit phải nằm trong khoảng từ 1 đến 100');
    }

    const allowedSortFields = ['name', 'createdAt'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException('sortBy không hợp lệ');
    }

    const normalizedSortOrder = sortOrder.toLowerCase();

    if (!['asc', 'desc'].includes(normalizedSortOrder)) {
      throw new BadRequestException('sortOrder chỉ nhận asc hoặc desc');
    }

    const sortColumn =
      sortBy === 'createdAt' ? 'category.created_at' : 'category.name';

    const query = this.categoryRepository.createQueryBuilder('category');

    if (search?.trim()) {
      query.where('category.name LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    const [categories, total] = await query
      .orderBy(sortColumn, normalizedSortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: categories.map((category) => ({
        id: category.category_id,
        name: category.name,
        description: category.description,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('Tên danh mục đã tồn tại');
    }

    const category = this.categoryRepository.create({
      name,
      description: description ?? null,
    });

    const savedCategory = await this.categoryRepository.save(category);

    return {
      data: {
        id: savedCategory.category_id,
        name: savedCategory.name,
        description: savedCategory.description,
        createdAt: savedCategory.created_at,
        updatedAt: savedCategory.updated_at,
      },
      message: 'Category created successfully',
    };
  }
}
