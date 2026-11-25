import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCopy } from './entities/book-copy.entity';

@Controller('copies')
export class BookCopiesController {
  constructor(
    @InjectRepository(BookCopy)
    private readonly bookCopyRepo: Repository<BookCopy>,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const copy = await this.bookCopyRepo.findOne({
      where: { copy_id: id },
      relations: {
        book: true,
    },
    });

    if (!copy) {
      throw new NotFoundException(`Không tìm thấy bản sao sách với ID = ${id}`);
    }

    return {
      data: {
        id: String(copy.copy_id),
        bookId: String(copy.book?.book_id ?? ''),
        copyCode: copy.copy_code,
        status: copy.status,
      },
      message: 'Success',
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    if (!status) {
      throw new BadRequestException('Trường status không được để trống');
    }

    const copy = await this.bookCopyRepo.findOne({
      where: { copy_id: id },
      relations: {
        book: true,
    },
    });

    if (!copy) {
      throw new NotFoundException(`Không tìm thấy bản sao sách với ID = ${id}`);
    }

    copy.status = status;
    const updated = await this.bookCopyRepo.save(copy);

    return {
      data: {
        id: String(updated.copy_id),
        bookId: String(updated.book?.book_id ?? ''),
        copyCode: updated.copy_code,
        status: updated.status,
      },
      message: 'Cập nhật trạng thái bản sao sách thành công',
    };
  }
}