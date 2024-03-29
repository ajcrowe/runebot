import {
  CollectionConfig,
  Sale,
  Market,
  MarketIcons,
  MarketMetaData,
  MarketURI,
  Item,
} from 'src/types';
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
        `Checking for sales ${collection.forgottenSlug}/Forgotten`,
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
          `Found ${sales.length} sales ${collection.forgottenSlug}/Forgotten`,
        );
      } else {
        this._logger.log(`No sales ${collection.forgottenSlug}/Forgotten`);
      }
    } catch (err) {
      this._logger.error(`${err} (${collection.forgottenSlug}/Forgotten)`);
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
    const sales: Array<Sale> = [];
    for (const sale of forgottenSales) {
      const market: MarketMetaData = await this.getMarketMetaData(
        sale.fillSource,
      );
      const cacheKey = `${sale.txHash}:${sale.token.tokenId}`;
      const time = Date.now() / 1000 - sale.timestamp;
      if (time < this.configService.bot.salesLookbackSeconds) {
        // check if sale already in broadcast
        if (await this.cacheService.isCached(cacheKey)) {
          break;
        }
        const buyerName = await this.etherService.getDomain(sale.to);
        const sellerName = await this.etherService.getDomain(sale.from);
        const item: Item = await this.dataStoreService.getItemByContract(
          sale.token.tokenId,
          c.tokenContract,
        );
        try {
          sales.push({
            id: sale.token.tokenId,
            title: `New Sale: ${item.name} (#${sale.token.tokenId})`,
            tokenSymbol: sale.price.currency.symbol,
            tokenPrice: sale.price.amount.native,
            usdPrice: `(${sale.price.amount.usd.toFixed(2)} USD)`,
            buyerAddr: sale.to,
            buyerName: buyerName ? `(${buyerName})` : ``,
            sellerAddr: sale.from,
            sellerName: sellerName ? `(${sellerName})` : ``,
            txHash: sale.txHash,
            cacheKey: cacheKey,
            permalink: `https://forgotten.market/${c.tokenContract}/${sale.token.tokenId}`,
            thumbnail: `${c.imageURI}/${sale.token.tokenId}.png`,
            backgroundColor: '000000',
            market: market.name,
            marketIcon: market.icon,
          });
        } catch (err) {
          this._logger.error(`${err} ${item} ${market}`);
          this._logger.debug(item);
          this._logger.debug(market);
        }
      }
    }
    return sales.reverse();
  }

  async getMarketMetaData(marketName: string): Promise<MarketMetaData> {
    switch (marketName) {
      case MarketURI.OPENSEA:
        return {
          name: Market.OPENSEA,
          icon: MarketIcons.OPENSEA,
          uri: MarketURI.OPENSEA,
        };
      case MarketURI.BLUR:
        return {
          name: Market.BLUR,
          icon: MarketIcons.BLUR,
          uri: MarketURI.BLUR,
        };
      case MarketURI.LOOKSRARE:
        return {
          name: Market.LOOKSRARE,
          icon: MarketIcons.LOOKSRARE,
          uri: MarketURI.LOOKSRARE,
        };
      case MarketURI.NFTX:
        return {
          name: Market.NFTX,
          icon: MarketIcons.NFTX,
          uri: MarketURI.NFTX,
        };
      case MarketURI.ZAAR:
        return {
          name: Market.ZAAR,
          icon: MarketIcons.ZAAR,
          uri: MarketURI.ZAAR,
        };
      case MarketURI.GEM || MarketURI.OPENSEAPRO:
        return {
          name: Market.GEM,
          icon: MarketIcons.GEM,
          uri: MarketURI.GEM,
        };
      case MarketURI.X2Y2:
        return {
          name: Market.X2Y2,
          icon: MarketIcons.X2Y2,
          uri: MarketURI.X2Y2,
        };
      case MarketURI.SUDOSWAP:
        return {
          name: Market.SUDOSWAP,
          icon: MarketIcons.SUDOSWAP,
          uri: MarketURI.SUDOSWAP,
        };
    }
    // return default for everything else
    return {
      name: Market.FORGOTTEN,
      icon: MarketIcons.FORGOTTEN,
      uri: MarketURI.FORGOTTEN,
    };
  }
}
