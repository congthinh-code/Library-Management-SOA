import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CatalogClientService } from './catalog-client.service.js';
import { ReaderClientService } from './reader-client.service.js';

@Module({
  imports: [HttpModule],
  providers: [ReaderClientService, CatalogClientService],
  exports: [ReaderClientService, CatalogClientService],
})
export class IntegrationModule {}