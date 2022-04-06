import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
