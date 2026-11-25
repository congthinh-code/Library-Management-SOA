import { CardStatus } from './reader.entity';

export class QueryReaderDto {
  page?: number;
  limit?: number;
  search?: string;
  cardStatus?: CardStatus;
}
