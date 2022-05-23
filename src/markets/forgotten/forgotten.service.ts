import { CollectionConfig, Sale, Market, MarketIcons } from 'src/types';
import { MarketService } from '../market.service';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config';
import { EthereumService } from '../../ethereum';
import { DataStoreService } from '../../datastore';
import { CacheService } from '../../cache';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ForgottenMarketService extends MarketService {
  private readonly _logger = new Logger(ForgottenMarketService.name);

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly cacheService: CacheService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    super();
  }

  get name(): string {
    return 'ForgottenMarketService';
  }

  /**
   * Get OS sales for specific collection
   */
  public async getSales(collection: CollectionConfig): Promise<Sale[]> {
    let sales: Array<Sale> = [];
    try {
      this._logger.log(
        `Checking for sales ${collection.openSeaSlug}/Forgotten`,
      );

      const response: AxiosResponse = await axios.get(
        `${this.configService.bot.forgottenApi}?collection=${collection.tokenContract}`,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
          },
          timeout: 10000,
        },
      );
      if (response.data.sales.length) {
        sales = await this.createSales(response.data.sales, collection);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/Forgotten`,
        );
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/Forgotten`);
      }
    } catch (err) {
      this._logger.error(`${err} (${collection.openSeaSlug}/Forgotten)`);
    } finally {
      return sales.reverse();
    }
  }

  /**
   * Process json response into Sale[] object
   */
  async createSales(
    forgottenSales: any[],
    c: CollectionConfig,
  ): Promise<Sale[]> {
    const ethPrice = await this.getPrice('ethereum', 'usd');
    const sales: Array<Sale> = [];
    for (const sale of forgottenSales) {
      const cacheKey = `${sale.txHash}:${sale.token.tokenId}`;
      const time = Date.now() / 1000 - sale.timestamp;
      if (time < this.configService.bot.salesLookbackSeconds) {
        // check if sale already in broadcast
        if (await this.cacheService.isCached(cacheKey)) {
          break;
        }
        const buyerName = await this.etherService.getDomain(sale.to);
        const sellerName = await this.etherService.getDomain(sale.from);
        sales.push({
          id: sale.token.tokenId,
          title: `New Sale: ${sale.token.name} (#${sale.token.tokenId})`,
          tokenSymbol: 'ETH',
          tokenPrice: sale.price,
          usdPrice: `(${(sale.price * ethPrice).toFixed(2)} USD)`,
          buyerAddr: sale.to,
          buyerName: buyerName ? `(${buyerName})` : ``,
          sellerAddr: sale.from,
          sellerName: sellerName ? `(${sellerName})` : ``,
          txHash: sale.txHash,
          cacheKey: cacheKey,
          permalink: `https://forgotten.market/en-US/${c.tokenContract}/${sale.token.tokenId}`,
          thumbnail: `${c.imageURI}/${sale.token.tokenId}.png`,
          backgroundColor: '000000',
          market: Market.FORGOTTEN,
          marketIcon: MarketIcons.FORGOTTEN,
        });
      }
    }
    return sales;
  }
}
