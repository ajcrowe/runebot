import { Module } from '@nestjs/common';
import { DataStoreService } from './datastore.service';
import { AppConfigModule } from '../config';

@Module({
  imports: [AppConfigModule],
  providers: [DataStoreService],
  exports: [DataStoreService],
})
export class DataStoreModule {}
