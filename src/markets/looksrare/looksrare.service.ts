import {
  CollectionConfig,
  Sale,
  LR_GET_SALES,
  Market,
  MarketIcons,
} from 'src/types';
import { MarketService } from '../market.service';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config';
import { EthereumService } from '../../ethereum';
import { DataStoreService } from '../../datastore';
import { CacheService } from '../../cache';
import 'cross-fetch/polyfill';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';

@Injectable()
export class LooksRareMarketService extends MarketService {
  private readonly _logger = new Logger(LooksRareMarketService.name);
  private readonly _lrClient: ApolloClient<NormalizedCacheObject>;

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly cacheService: CacheService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    super();
    this._lrClient = new ApolloClient({
      uri: this.configService.bot.looksRareApi,
      cache: new InMemoryCache(),
      defaultOptions: this.apolloDefaultOptions,
    });
  }

  get name(): string {
    return 'LooksRareMarketService';
  }

  /**
   * Get OS sales for specific collection
   */
  public async getSales(collection: CollectionConfig): Promise<Sale[]> {
    const queryVariables = {
      filter: {
        collection: collection.tokenContract,
        type: ['SALE'],
      },
      pagination: {
        first: 20,
      },
    };
    try {
      this._logger.log(
        `Checking for sales ${collection.openSeaSlug}/LooksRare`,
      );
      const response = await this._lrClient.query({
        query: LR_GET_SALES,
        variables: queryVariables,
      });
      if (response.error) {
        this._logger.debug(response.error);
      }
      if (response.data.events.length) {
        const sales = await this.createSales(response.data.events, collection);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/LooksRare`,
        );
        return sales.reverse();
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/LooksRare`);
        return [];
      }
    } catch (error) {
      this._logger.error(error.networkError.result);
    }
  }

  /**
   * Process OS json response into Sale[] object
   */
  async createSales(lrSales: any[], c: CollectionConfig): Promise<Sale[]> {
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
        const buyerName = await this.etherService.getDomain(sale.to.address);
        const sellerName = await this.etherService.getDomain(sale.from.address);
        sales.push({
          id: sale.token.tokenId,
          title: `New Sale: ${sale.token.name} (#${sale.token.tokenId})`,
          tokenSymbol: 'WETH',
          tokenPrice: price,
          usdPrice: `(${(price * ethPrice).toFixed(2)} USD)`,
          buyerAddr: sale.to.address,
          buyerName: sale.to.name
            ? `(${sale.to.name})`
            : buyerName
            ? `(${buyerName})`
            : ``,
          sellerAddr: sale.from.address,
          sellerName: sale.from.name
            ? `(${sale.from.name})`
            : sellerName
            ? `(${sellerName})`
            : ``,
          txHash: sale.hash,
          cacheKey: cacheKey,
          permalink: `https://looksrare.org/collections/${sale.collection.address}/${sale.token.tokenId}`,
          thumbnail: `${c.imageURI}/${sale.token.tokenId}.png`,
          backgroundColor: '000000',
          market: Market.LOOKSRARE,
          marketIcon: MarketIcons.LOOKSRARE,
        });
      }
    }
    return sales;
  }
}
