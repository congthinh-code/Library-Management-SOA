
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

  @Get()
  findAll(@Query() query: QueryReaderDto) {
    return this.service.findAll(query);
  }

  // Lấy hồ sơ độc giả theo tài khoản đang đăng nhập
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() req: AuthenticatedRequest) {
    return this.service.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateReaderDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReaderDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/card-status')
  updateCardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCardStatusDto,
  ) {
    return this.service.updateCardStatus(id, dto.cardStatus);
  }
}
