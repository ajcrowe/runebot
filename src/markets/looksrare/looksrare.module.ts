import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';
import { LooksRareMarketService } from './looksrare.service';

@Module({
  imports: [AppConfigModule, DataStoreModule, EthereumModule],
  providers: [LooksRareMarketService],
  exports: [LooksRareMarketService],
})
export class LooksRareMarketModule {}
