import {
  CollectionConfig,
  Sale,
  Market,
  MarketIcons,
} from 'src/types';
import { MarketService } from '../market.service';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config';
import { EthereumService } from '../../ethereum';
import { DataStoreService } from '../../datastore';
import { CacheService } from '../../cache';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class LooksRareMarketService extends MarketService {
  private readonly _logger = new Logger(LooksRareMarketService.name);

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly cacheService: CacheService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    super();
  }

  get name(): string {
    return 'LooksRareMarketService';
  }

  /**
   * Get OS sales for specific collection
   */
  public async getSales(collection: CollectionConfig): Promise<Sale[]> {
    let sales: Array<Sale> = [];
    try {
      // wait random time to avoid spamming OS
      await this.sleep(Math.floor(Math.random() * 5000));

      const response: AxiosResponse = await axios.get(
        `${this.configService.bot.looksRareApi}?collection=${collection.tokenContract}&type=SALE`,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
          },
          timeout: 10000,
        },
      );

      if (response.data.data.length) {
        sales = await this.createSales(response.data.data);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/LooksRare`,
        );
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/LooksRare`);
      }
    } catch (err) {
      this._logger.error(`${err} (${collection.openSeaSlug}/LooksRare)`);
    } finally {
      return sales.reverse();
    }
  }
  /**
   * Process JSON response into Sale[] object
   */
  async createSales(lrSales: any[]): Promise<Sale[]> {
    const ethPrice = await this.getPrice('ethereum', 'usd');
    const sales: Array<Sale> = [];
    for (const sale of lrSales) {
      const price = sale.order.price / 10 ** 18;
      const cacheKey = `${sale.hash}:${sale.token.tokenId}`;
      const time = Date.now() - Date.parse(sale.createdAt);
      const timeSec = time / 1000;
      if (timeSec < this.configService.bot.salesLookbackSeconds) {
        // check if sale already in broadcast
        if (await this.cacheService.isCached(cacheKey)) {
          break;
        }
        const buyerName = await this.etherService.getDomain(sale.to);
        const sellerName = await this.etherService.getDomain(sale.from);
        sales.push({
          id: sale.token.tokenId,
          title: `New Sale: ${sale.token.name} (#${sale.token.tokenId})`,
          tokenSymbol: 'WETH',
          tokenPrice: price,
          usdPrice: `(${(price * ethPrice).toFixed(2)} USD)`,
          buyerAddr: sale.to,
          buyerName: buyerName ? `(${buyerName})` : ``,
          sellerAddr: sale.from,
          sellerName: sellerName ? `(${sellerName})` : ``,
          txHash: sale.hash,
          cacheKey: cacheKey,
          permalink: `https://looksrare.org/collections/${sale.collection.address}/${sale.token.tokenId}`,
          thumbnail: sale.token.imageURI,
          backgroundColor: '000000',
          market: Market.LOOKSRARE,
          marketIcon: MarketIcons.LOOKSRARE,
        });
      }
    }
    return sales;
  }
}
