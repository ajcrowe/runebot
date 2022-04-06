import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';
import { NFTXMarketService } from './nftx.service';

@Module({
  imports: [AppConfigModule, DataStoreModule, EthereumModule],
  providers: [NFTXMarketService],
  exports: [NFTXMarketService],
})
export class NFTXMarketModule {}
