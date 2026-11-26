import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateReaderDto } from './create-reader.dto';
import { QueryReaderDto } from './query-reader.dto';
import { ReadersService } from './readers.service';
import { UpdateCardStatusDto } from './update-card-status.dto';
import { UpdateReaderDto } from './update-reader.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
    roles: string[];
  };
}

@Controller('readers')
export class ReadersController {
  constructor(private readonly service: ReadersService) {}

  // ADMIN và STAFF: Xem danh sách độc giả
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findAll(@Query() query: QueryReaderDto) {
    return this.service.findAll(query);
  }

  // READER: Lấy hồ sơ của chính tài khoản đang đăng nhập
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('READER')
  findMe(@Req() req: AuthenticatedRequest) {
    return this.service.findByUserId(req.user.userId);
  }

  // ADMIN và STAFF: Xem chi tiết độc giả
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ADMIN và STAFF: Thêm độc giả
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() dto: CreateReaderDto) {
    return this.service.create(dto);
  }

  // ADMIN và STAFF: Chỉnh sửa thông tin độc giả
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReaderDto,
  ) {
    return this.service.update(id, dto);
  }

  // ADMIN và STAFF: Cập nhật trạng thái thẻ
  @Patch(':id/card-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  updateCardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCardStatusDto,
  ) {
    return this.service.updateCardStatus(id, dto.cardStatus);
  }
}
