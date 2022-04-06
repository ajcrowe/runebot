import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config';
import { DataStoreModule } from 'src/datastore';
import { EthereumModule } from 'src/ethereum';
import { ForgottenMarketService } from './forgotten.service';

@Module({
  imports: [AppConfigModule, DataStoreModule, EthereumModule],
  providers: [ForgottenMarketService],
  exports: [ForgottenMarketService],
})
export class ForgottenMarketModule {}
