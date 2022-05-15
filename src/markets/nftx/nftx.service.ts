import { CollectionConfig, Sale, Item, Market, MarketIcons } from 'src/types';
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
  private readonly _sushiClient: ApolloClient<NormalizedCacheObject>;

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
    this._sushiClient = new ApolloClient({
      uri: this.configService.bot.sushiApi,
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
        zapAction {
          ethAmount
          id
        }
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
        user {
          id
        }
        date
        nftIds
        specificIds
        randomCount
        targetCount
        feeReceipt {
          transfers {
            amount
          }
          date
        }
      }
    }`;

    let sales: Array<Sale> = [];
    try {
      this._logger.log(`Checking for sales${collection.openSeaSlug}/NFTx`);
      const response = await this._nftxClient.query({
        query: NFTX_GET_REDEEM,
      });
      if (response.error) {
        this._logger.debug(response.error);
      }
      if (response.data.redeems.length) {
        sales = await this.createSales(response.data.redeems, collection);
        this._logger.log(
          `Found ${sales.length} sales ${collection.openSeaSlug}/NFTx`,
        );
      } else {
        this._logger.log(`No sales ${collection.openSeaSlug}/NFTx`);
      }
    } catch (error) {
      this._logger.error(error);
    } finally {
      return sales.reverse();
    }
  }

  /**
   * Process OS json response into Sale[] object
   */
  async createSales(redeems: any[], c: CollectionConfig): Promise<Sale[]> {
    const SUSHI_GET_TOKEN = gql`
    {
      tokens(
        where: {id: "${c.nftxVaultContract}"}
      ) {
        ...tokenFields
      }
    }

    fragment tokenFields on Token {
      id
      symbol
      name
      decimals
      totalSupply
      volume
      volumeUSD
      untrackedVolumeUSD
      txCount
      liquidity
      derivedETH
    }`;

    const ethUsd = await this.getPrice('ethereum', 'usd');
    let price: number;
    try {
      const resp = await this._sushiClient.query({
        query: SUSHI_GET_TOKEN,
      });
      price = Number(resp.data.tokens[0].derivedETH);
    } catch (err) {
      this._logger.error(err);
    }
    const sales: Array<Sale> = [];
    for (const sale of redeems) {
      const usdPrice = price * ethUsd;
      const cacheKey = sale.id;
      // check if sale already in broadcast
      if (await this.cacheService.isCached(cacheKey)) {
        break;
      }
      for (const nftId of sale.nftIds) {
        const item: Item = await this.dataStoreService.getItem(
          nftId,
          sale.vault.token.symbol,
        );
        const buyerAddr = await this.etherService.getOwner(c, item.serial);
        const buyerName = await this.etherService.getDomain(buyerAddr);
        sales.push({
          id: item.serial,
          title: `New Sale: ${item.name} (#${nftId})`,
          tokenSymbol: 'ETH',
          tokenPrice: price,
          usdPrice: `(${usdPrice.toFixed(2)} USD)`,
          buyerAddr: buyerAddr,
          buyerName: buyerName ? `(${buyerName})` : ``,
          sellerAddr: c.nftxVaultContract,
          sellerName: ``,
          txHash: sale.id,
          cacheKey: cacheKey,
          permalink: `https://nftx.io/vault/${sale.vault.id}/${nftId}`,
          thumbnail: `${c.imageURI}/${nftId}.png`,
          backgroundColor: '000000',
          market: Market.NFTX,
          marketIcon: MarketIcons.NFTX,
        });
      }
    }
    return sales;
  }
}
