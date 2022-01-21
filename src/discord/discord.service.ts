import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config';
import { EthereumService } from 'src/ethereum';
import Discord, { TextChannel, MessageEmbed } from 'discord.js';
import toRegexRange from 'to-regex-range';
import {
  Wizard,
  Soul,
  Pony,
  Sale,
  CollectionConfig,
  MarketIcons,
} from 'src/types';
import { DataStoreService } from '../datastore';
import fetch from 'node-fetch';
import 'cross-fetch/polyfill';
import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
} from '@apollo/client/core';

@Injectable()
export class DiscordService {
  private readonly _logger = new Logger(DiscordService.name);
  private readonly _client = new Discord.Client();
  private readonly _rangeRegex = new RegExp(`^${toRegexRange('1', '10000')}$`);
  private readonly _lrClient: ApolloClient<NormalizedCacheObject>;

  protected _salesChannels: Array<TextChannel>;
  protected _recentTransactions: Array<string>;

  get name(): string {
    return 'DiscordService';
  }

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
  ) {
    const { token, salesChannelIds } = this.configService.discord;
    this._lrClient = new ApolloClient({
      uri: this.configService.bot.looksRareApi,
      cache: new InMemoryCache(),
    });
    this._client.login(token);
    this._client.on('ready', async () => {
      this._salesChannels = [];
      for (const channelId of salesChannelIds) {
        this._salesChannels.push(
          (await this._client.channels.fetch(channelId)) as TextChannel,
        );
      }
      this._recentTransactions = [];
    });
    this.channelWatcher();
  }

  /**
   * Post a sale
   */
  public postSale(embed: MessageEmbed): void {
    for (const channel of this._salesChannels) {
      channel.send(embed);
    }
  }

  /**
   * Cache sale
   */
  public cacheSale(cacheKey: string): void {
    this._recentTransactions.push(cacheKey);
    // trim cache if longer than 100
    if (this._recentTransactions.length > 100) {
      this._recentTransactions = this._recentTransactions.slice(
        Math.max(this._recentTransactions.length - 100, 0),
      );
    }
  }

  /**
   * Check for Sales
   */
  public async checkSales(cs: CollectionConfig[]): Promise<void> {
    for (const c of cs) {
      const sales: Array<Sale> = [];
      sales.push(...(await this.getOSSales(c)));
      sales.push(...(await this.getLRSales(c)));

      for (const sale of sales) {
        const embed = new MessageEmbed()
          .setColor(sale.backgroundColor)
          .setTitle(sale.title)
          .setURL(sale.permalink)
          .setThumbnail(sale.thumbnail)
          .addFields(this.getStandardFields(sale))
          .setFooter(sale.market, MarketIcons[sale.market]);

        this.postSale(embed);
        this.cacheSale(sale.cacheKey);
      }
    }
  }

  /**
   * Get OS sales for specific collection
   */
  public async getOSSales(collection: CollectionConfig): Promise<Sale[]> {
    try {
      // wait random time to avoid spamming OS
      await this.sleep(Math.floor(Math.random() * 120 * 1000));
      // look back window for query
      const timestamp = new Date(
        Date.now() - Number(this.configService.bot.salesLookbackSeconds) * 1000,
      ).toISOString();

      const url = `https://api.opensea.io/api/v1/events?collection_slug=${collection.openSeaSlug}&event_type=successful&only_opensea=false&offset=0&limit=100&occurred_after=${timestamp}`;
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-KEY': this.configService.bot.openSeaApiKey,
        },
      };
      const response = await fetch(url, options);
      const json = await response.json();
      const sales = await this.createSalesFromOS(json.asset_events);
      return sales.reverse();
    } catch (err) {
      this._logger.error(err);
    }
  }

  /**
   * Get LR sales for specific collection
   */
  public async getLRSales(collection: CollectionConfig): Promise<Sale[]> {
    const LR_FRAGMENTS = gql`
      fragment EventFragment on Event {
        id
        from
        to
        hash
        createdAt
        token {
          tokenId
          image
          name
        }
        collection {
          address
          name
          description
          totalSupply
          logo
          floorOrder {
            price
          }
        }
        order {
          isOrderAsk
          price
          endTime
          currency
          strategy
          status
          params
        }
      }
    `;
    const LR_GET_SALES = gql`
      query GetEventsQuery(
        $pagination: PaginationInput
        $filter: EventFilterInput
      ) {
        events(pagination: $pagination, filter: $filter) {
          ...EventFragment
        }
      }
      ${LR_FRAGMENTS}
    `;

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
      const response = await this._lrClient.query({
        query: LR_GET_SALES,
        variables: queryVariables,
      });
      const sales = await this.createSalesFromLR(
        response.data.events,
        collection,
      );
      return sales.reverse();
    } catch (error) {
      this._logger.error(error.networkError.result);
    }
  }

  /**
   * Process OS json response into Sale[] object
   */
  public async createSalesFromOS(osSales: any[]): Promise<Sale[]> {
    const sales: Array<Sale> = [];
    for (const sale of osSales) {
      const price = sale.total_price / 10 ** sale.payment_token.decimals;
      const cacheKey = `${sale.transaction.transaction_hash}:${sale.asset.token_id}`;
      // check if sale already in broadcast
      if (this._recentTransactions.includes(cacheKey)) {
        break;
      }
      sales.push({
        id: sale.asset.token_id,
        title: `New Sale: ${sale.asset.name} (#${sale.asset.token_id})`,
        tokenSymbol: sale.payment_token.symbol,
        tokenPrice: price,
        usdPrice: `($${(price * sale.payment_token.usd_price).toFixed(2)} USD)`,
        buyerAddr: sale.winner_account.address,
        buyerName:
          sale.winner_account.user && sale.winner_account.user.username
            ? `(${sale.winner_account.user.username})`
            : ``,
        sellerAddr: sale.seller.address,
        sellerName:
          sale.winner_account.user && sale.winner_account.user.username
            ? `(${sale.winner_account.user.username})`
            : ``,
        txHash: sale.transaction.transaction_hash,
        cacheKey: cacheKey,
        permalink: sale.asset.permalink,
        thumbnail: sale.asset.image_preview_url,
        backgroundColor: sale.asset.background_color || '000000',
        market: 'OpenSea',
      });
    }
    return sales;
  }

  /**
   * Process LR response into Sale[] object
   */
  public async createSalesFromLR(
    lrSales: any[],
    c: CollectionConfig,
  ): Promise<Sale[]> {
    const sales: Array<Sale> = [];
    for (const sale of lrSales) {
      const price = sale.order.price / 10 ** 18;
      const cacheKey = `${sale.hash}:${sale.token.tokenId}`;
      // check if sale already in broadcast
      if (this._recentTransactions.includes(cacheKey)) {
        break;
      }
      const time = Date.now() - Date.parse(sale.createdAt);
      if (time < this.configService.bot.salesLookbackSeconds * 1000) {
        sales.push({
          id: sale.token.tokenId,
          title: `New Sale: ${sale.token.name} (#${sale.token.tokenId})`,
          tokenSymbol: 'WETH',
          tokenPrice: price,
          usdPrice: ``,
          buyerAddr: sale.to,
          buyerName: ``,
          sellerAddr: sale.from,
          sellerName: ``,
          txHash: sale.hash,
          cacheKey: cacheKey,
          permalink: `https://looksrare.org/collections/${sale.collection.address}/${sale.token.tokenId}`,
          thumbnail: `${c.imageURI}/${sale.token.tokenId}.png`,
          backgroundColor: '000000',
          market: 'LooksRare',
        });
      }
    }
    return sales;
  }

  /*
   * get standard fields for each sale
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public getStandardFields(sale: Sale): any[] {
    return [
      {
        name: 'Amount',
        value: `${sale.tokenPrice} ${sale.tokenSymbol} ${sale.usdPrice}`,
        inline: false,
      },
      {
        name: 'Buyer',
        value: `[${sale.buyerAddr.slice(0, -34)}](https://opensea.io/accounts/${
          sale.buyerAddr
        }) ${sale.buyerName}`,
        inline: true,
      },
      {
        name: 'Seller',
        value: `[${sale.sellerAddr.slice(
          0,
          -34,
        )}](https://opensea.io/accounts/${sale.sellerAddr}) ${sale.sellerName}`,
        inline: true,
      },
    ];
  }

  /*
   * watch channel for requests for data
   */
  public async channelWatcher(): Promise<void> {
    const { prefix } = this.configService.discord;
    this._client.on('message', async message => {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
      if (this.configService.isDevelopment) {
        if (message.channel.id != '843121547358109700') return;
      }

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(' ');
      const id = args[0].toLowerCase();
      if (!this._rangeRegex.test(id)) {
        this._logger.log(`Wizard out of range`);
        return;
      }

      const collection = args[1];

      let embed: MessageEmbed;
      switch (collection) {
        case 'pony':
          const pony: Pony = await this.dataStoreService.getPony(id);
          embed = new MessageEmbed()
            .setColor(pony.backgroundColor)
            .setAuthor(
              `${pony.name} (#${pony.serial})`,
              'https://cdn.discordapp.com/app-icons/843121928549957683/af28e4f65099eadebbb0635b1ea8d0b2.png?size=64',
              `${this.configService.pony.openSeaBaseURI}/${pony.serial}`,
            )
            .setURL(
              `https://opensea.io/assets/${this.configService.pony.tokenContract}/${pony.serial}`,
            )
            .setThumbnail(
              `${this.configService.pony.imageURI}/${pony.serial}.png`,
            )
            .addFields(pony.traits);
          break;
        case 'affinity':
          break;
        case 'name':
          break;
        default:
          if (await this.dataStoreService.checkSoul(id)) {
            const soul: Soul = await this.dataStoreService.getSoul(id);
            this._logger.log(`Fetched Soul: ${soul.name} (${id})`);
            embed = new MessageEmbed()
              .setColor(soul.backgroundColor)
              .setAuthor(
                `${soul.name} (#${soul.serial})`,
                'https://cdn.discordapp.com/app-icons/843121928549957683/af28e4f65099eadebbb0635b1ea8d0b2.png?size=64',
                `${this.configService.soul.openSeaBaseURI}/${soul.serial}`,
              )
              .setURL(
                `https://opensea.io/assets/${this.configService.soul.tokenContract}/${soul.serial}`,
              )
              .setThumbnail(
                `${this.configService.soul.imageURI}/${soul.serial}.png`,
              )
              .addFields(soul.traits);
          } else {
            const wizard: Wizard = await this.dataStoreService.getWizard(id);
            this._logger.log(`Fetched Wizard: ${wizard.name} (${id})`);
            const fields = this.dataStoreService.getWizardFields(wizard);
            embed = new MessageEmbed()
              .setColor(wizard.backgroundColor)
              .setAuthor(
                `${wizard.name} (#${wizard.serial})`,
                'https://cdn.discordapp.com/app-icons/843121928549957683/af28e4f65099eadebbb0635b1ea8d0b2.png?size=64',
                `${this.configService.wizard.openSeaBaseURI}/${wizard.serial}`,
              )
              .setURL(
                `${this.configService.wizard.openSeaBaseURI}/${wizard.serial}`,
              )
              .setThumbnail(
                `${this.configService.wizard.imageURI}/${wizard.serial}.png`,
              )
              .addFields(fields);
          }
          break;
      }
      try {
        message.reply({ embed: embed });
      } catch (error) {
        this._logger.error(`error posting wizard ${id}, ${error}`);
        return;
      }
    });
  }

  public async sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
