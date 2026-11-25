import { ReaderType } from './reader.entity';

export class UpdateReaderDto {
  readerCode?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  readerType?: ReaderType;
  userId?: number;
}
