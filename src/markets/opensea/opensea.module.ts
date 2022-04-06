import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';
import { OpenSeaMarketService } from './opensea.service';

@Module({
  imports: [AppConfigModule, DataStoreModule, EthereumModule],
  providers: [OpenSeaMarketService],
  exports: [OpenSeaMarketService],
})
export class OpenSeaMarketModule {}
