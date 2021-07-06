import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AppConfigModule } from '../config';

@Module({
  imports: [AppConfigModule],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
