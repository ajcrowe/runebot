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
import {
  OpenSeaMarketService,
  LooksRareMarketService,
  NFTXMarketService,
  ForgottenMarketService,
} from 'src/markets';
import { DataStoreService } from '../datastore';
import { CacheService } from 'src/cache';

@Injectable()
export class DiscordService {
  private readonly _logger = new Logger(DiscordService.name);
  private readonly _client = new Discord.Client();
  private readonly _rangeRegex = new RegExp(`^${toRegexRange('1', '10000')}$`);

  protected _salesChannels: Array<TextChannel>;
  protected _recentTransactions: Array<string>;

  get name(): string {
    return 'DiscordService';
  }

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly etherService: EthereumService,
    protected readonly dataStoreService: DataStoreService,
    protected readonly cacheService: CacheService,
    protected readonly openSeaMarket: OpenSeaMarketService,
    protected readonly looksRareMarket: LooksRareMarketService,
    protected readonly nftxMarket: NFTXMarketService,
    protected readonly forgottenMarket: ForgottenMarketService,
  ) {
    const { token, salesChannelIds } = this.configService.discord;
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
   * Check for Sales
   */
  public async checkSales(cs: CollectionConfig[]): Promise<void> {
    for (const c of cs) {
      await this.postSales(await this.openSeaMarket.getSales(c));
      await this.postSales(await this.looksRareMarket.getSales(c));
      if (c.openSeaSlug === 'forgottenruneswizardscult') {
        await this.postSales(await this.nftxMarket.getSales(c));
      }
      if (c.openSeaSlug != 'infinityveil') {
        await this.postSales(await this.forgottenMarket.getSales(c));
      }
    }
  }

  /**
   * Post a sale
   */
  public async postSale(embed: MessageEmbed): Promise<void> {
    for (const channel of this._salesChannels) {
      try {
        await channel.send(embed);
      } catch (err) {
        this._logger.error(err);
      }
    }
  }

  /**
   * Post Sales
   */

  public async postSales(sales: Sale[]): Promise<void> {
    for (const sale of sales) {
      const embed = new MessageEmbed()
        .setColor(sale.backgroundColor)
        .setTitle(sale.title)
        .setURL(sale.permalink)
        .setThumbnail(sale.thumbnail)
        .addFields(this.getStandardFields(sale))
        .setFooter(sale.market, sale.marketIcon);

      await this.postSale(embed);
      await this.cacheService.cacheSale(sale.cacheKey);
    }
  }

  /*
   * get standard fields for each sale
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public getStandardFields(sale: Sale): any[] {
    return [
      {
        name: 'Amount',
        value: `${sale.tokenPrice.toFixed(2)} ${sale.tokenSymbol} ${
          sale.usdPrice
        }`,
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
