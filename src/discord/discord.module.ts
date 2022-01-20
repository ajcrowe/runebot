import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AppConfigModule } from '../config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';

@Module({
  imports: [AppConfigModule, DataStoreModule, EthereumModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
