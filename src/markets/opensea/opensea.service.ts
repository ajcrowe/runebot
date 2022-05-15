import { CollectionConfig, Sale, Market, MarketIcons } from 'src/types';
import { MarketService } from '../market.service';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config';
import { EthereumService } from '../../ethereum';
import { DataStoreService } from '../../datastore';
import { CacheService } from '../../cache';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class OpenSeaMarketService extends MarketService {
  private readonly _logger = new Logger(OpenSeaMarketService.name);

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly cacheService: CacheService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    super();
  }

  get name(): string {
    return 'OpenSeaMarketService';
  }

  /**
   * Get OS sales for specific collection
   */
  public async getSales(collection: CollectionConfig): Promise<Sale[]> {
    let sales: Array<Sale> = [];
    try {
      // wait random time to avoid spamming OS
      await this.sleep(Math.floor(Math.random() * 5000));

      this._logger.log(`Checking for sales ${collection.openSeaSlug}/OpenSea`);

      const response: AxiosResponse = await axios.get(
        `https://api.opensea.io/api/v1/events?asset_contract_address=${collection.tokenContract}&event_type=successful&only_opensea=false`,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'X-API-KEY': this.configService.bot.openSeaApiKey,
          },
          timeout: 10000,
        },
      );

      if (response.data.asset_events.length) {
        sales = await this.createSales(response.data.asset_events);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/OpenSea`,
        );
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/OpenSea`);
      }
    } catch (err) {
      this._logger.error(`${err} (${collection.openSeaSlug}/OpenSea)`);
    } finally {
      return sales.reverse();
    }
  }

  /**
   * Process OS json response into Sale[] object
   */
  async createSales(osSales: any[]): Promise<Sale[]> {
    const sales: Array<Sale> = [];
    for (const sale of osSales) {
      if (sale.asset_bundle) {
        this._logger.debug(sale);
        break;
      }
      const cacheKey = `${sale.transaction.transaction_hash}:${sale.asset.token_id}`;
      const time = Date.now() - Date.parse(sale.created_date);
      const timeSec = time / 1000;
      if (timeSec < this.configService.bot.salesLookbackSeconds) {
        // check if sale already in broadcast
        if (await this.cacheService.isCached(cacheKey)) {
          break;
        }

        this._logger.debug(`Fetching ENS buyer name`);
        const buyerName = await this.etherService.getDomain(
          sale.winner_account.address,
        );
        this._logger.debug(`Fetching ENS seller name`);
        const sellerName = await this.etherService.getDomain(
          sale.seller.address,
        );
        const price = sale.total_price / 10 ** sale.payment_token.decimals;

        sales.push({
          id: sale.asset.token_id,
          title: `New Sale: ${sale.asset.name} (#${sale.asset.token_id})`,
          tokenSymbol: sale.payment_token.symbol,
          tokenPrice: price,
          usdPrice: `($${(price * sale.payment_token.usd_price).toFixed(
            2,
          )} USD)`,
          buyerAddr: sale.winner_account.address,
          buyerName:
            sale.winner_account.user && sale.winner_account.user.username
              ? `(${sale.winner_account.user.username})`
              : buyerName
              ? `(${buyerName})`
              : ``,
          sellerAddr: sale.seller.address,
          sellerName:
            sale.seller.user && sale.seller.user.username
              ? `(${sale.seller.user.username})`
              : sellerName
              ? `(${sellerName})`
              : ``,
          txHash: sale.transaction.transaction_hash,
          cacheKey: cacheKey,
          permalink: sale.asset.permalink,
          thumbnail: sale.asset.image_preview_url,
          backgroundColor: sale.asset.background_color || '000000',
          market: Market.OPENSEA,
          marketIcon: MarketIcons.OPENSEA,
        });
      }
    }
    return sales;
  }
}
