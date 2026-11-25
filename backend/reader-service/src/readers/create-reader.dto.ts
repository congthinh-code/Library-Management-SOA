import { ReaderType } from './reader.entity';

export class CreateReaderDto {
  readerCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  readerType: ReaderType;
  userId?: number;
}
