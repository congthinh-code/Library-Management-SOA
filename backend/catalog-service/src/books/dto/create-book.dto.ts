
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Tên sách phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sách không được để trống' })
  @MaxLength(255, {
    message: 'Tên sách không được vượt quá 255 ký tự',
  })
  title: string;

  @IsOptional()
  @IsString({ message: 'ISBN phải là chuỗi' })
  @MaxLength(20, {
    message: 'ISBN không được vượt quá 20 ký tự',
  })
  isbn?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Nhà xuất bản phải là chuỗi' })
  @MaxLength(150, {
    message: 'Tên nhà xuất bản không được vượt quá 150 ký tự',
  })
  publisher?: string;

  @IsOptional()
  @IsInt({ message: 'Năm xuất bản phải là số nguyên' })
  @Min(0)
  @Max(9999)
  publishedYear?: number;

  @IsString({ message: 'categoryId phải là chuỗi' })
  @Matches(/^[1-9]\d*$/, {
    message: 'categoryId phải là ID hợp lệ',
  })
  categoryId: string;

  @IsOptional()
  @IsArray({ message: 'authorIds phải là một mảng' })
  @IsString({ each: true, message: 'Mỗi authorId phải là chuỗi' })
  authorIds?: string[];
}
