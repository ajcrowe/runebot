import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AppConfigModule } from '../config';
import { DataStoreModule } from 'src/datastore';

@Module({
  imports: [AppConfigModule, DataStoreModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
