import { CollectionConfig, Sale, Wizard, Market, MarketIcons } from 'src/types';
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
  gql,
} from '@apollo/client/core';

@Injectable()
export class NFTXMarketService extends MarketService {
  private readonly _logger = new Logger(NFTXMarketService.name);
  private readonly _nftxClient: ApolloClient<NormalizedCacheObject>;

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly cacheService: CacheService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    super();
    this._nftxClient = new ApolloClient({
      uri: this.configService.bot.nftxApi,
      cache: new InMemoryCache(),
      defaultOptions: this.apolloDefaultOptions,
    });
  }

  get name(): string {
    return 'NFTXMarketService';
  }

  /**
   * Get OS sales for specific collection
   */
  public async getSales(collection: CollectionConfig): Promise<Sale[]> {
    const timestamp =
      Math.floor(Date.now() / 1000) -
      Number(this.configService.bot.salesLookbackSeconds);
    const NFTX_GET_REDEEM = gql`
    {
      redeems(
        first: 100,
        where: { date_gt: "${timestamp}", vault: "${collection.nftxVaultContract}" },
        orderBy: date,
        orderDirection: desc
      ) {
        id
        vault {
          id
          vaultId
          token {
            symbol
          }
          asset {
            id
          }
        }
        date
        nftIds
        specificIds
        randomCount
        targetCount
        feeReceipt {
          amount
          date
        }
      }
    }`;

    //
    try {
      this._logger.log(`Checking for sales${collection.openSeaSlug}/NFTx`);
      const response = await this._nftxClient.query({
        query: NFTX_GET_REDEEM,
      });
      if (response.error) {
        this._logger.debug(response.error);
      }
      if (response.data.redeems.length) {
        this._logger.log(response.data.redeems);
        const sales = await this.createSales(response.data.redeems, collection);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/NFTx`,
        );
        return sales.reverse();
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/NFTx`);
        return [];
      }
    } catch (error) {
      this._logger.error(error);
    }
  }

  /**
   * Process OS json response into Sale[] object
   */
  async createSales(redeems: any[], c: CollectionConfig): Promise<Sale[]> {
    const price = (await this.getPrice('wizard-vault-nftx', 'eth')) * 1.05;
    const usdPrice = price * (await this.getPrice('ethereum', 'usd'));

    const sales: Array<Sale> = [];
    for (const sale of redeems) {
      const cacheKey = sale.id;
      // check if sale already in broadcast
      if (await this.cacheService.isCached(cacheKey)) {
        break;
      }
      for (const nft of sale.nftIds) {
        const wizard: Wizard = await this.dataStoreService.getWizard(nft);
        const buyerAddr = await this.etherService.getOwner(c, wizard.serial);
        const buyerName = await this.etherService.getDomain(buyerAddr);
        sales.push({
          id: wizard.serial,
          title: `New Sale: ${wizard.name} (#${wizard.serial})`,
          tokenSymbol: 'ETH',
          tokenPrice: price,
          usdPrice: `(${usdPrice.toFixed(2)} USD)`,
          buyerAddr: buyerAddr,
          buyerName: buyerName ? `(${buyerName})` : ``,
          sellerAddr: c.nftxVaultContract,
          sellerName: ``,
          txHash: sale.id,
          cacheKey: cacheKey,
          permalink: `https://nftx.io/vault/${sale.vault.id}/${wizard.serial}`,
          thumbnail: `${c.imageURI}/${wizard.serial}.png`,
          backgroundColor: '000000',
          market: Market.NFTX,
          marketIcon: MarketIcons.NFTX,
        });
      }
    }
    return sales;
  }
}
