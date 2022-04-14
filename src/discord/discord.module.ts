import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AppConfigModule } from '../config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';
import { OpenSeaMarketModule } from 'src/markets/opensea';
import {
  ForgottenMarketModule,
  LooksRareMarketModule,
  NFTXMarketModule,
} from 'src/markets';

@Module({
  imports: [
    AppConfigModule,
    DataStoreModule,
    EthereumModule,
    OpenSeaMarketModule,
    LooksRareMarketModule,
    NFTXMarketModule,
    ForgottenMarketModule,
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
