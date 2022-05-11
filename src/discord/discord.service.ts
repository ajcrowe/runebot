import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config';
import { EthereumService } from 'src/ethereum';
import Discord, { TextChannel, MessageEmbed } from 'discord.js';
import toRegexRange from 'to-regex-range';
import { CollectionConfig, Wizard, Sale, Item } from 'src/types';
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
      if (c.openSeaSlug != 'babywizards') {
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

      if (await this.cacheService.isCached(sale.cacheKey)) {
        break;
      } else {
        await this.cacheService.cacheSale(sale.cacheKey);
      }
      await this.postSale(embed);
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
        value: `[${sale.buyerAddr.slice(0, -34)}](${
          this.configService.bot.forgottenBaseURI
        }/address/${sale.buyerAddr}) ${sale.buyerName}`,
        inline: true,
      },
      {
        name: 'Seller',
        value: `[${sale.sellerAddr.slice(0, -34)}](${
          this.configService.bot.forgottenBaseURI
        }/address/${sale.sellerAddr}) ${sale.sellerName}`,
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
        this._logger.log(`Item out of range`);
        return;
      }

      const collection = args[1];
      let embed: MessageEmbed;

      switch (collection) {
        case 'pony':
          embed = await this.getEmbed(
            await this.dataStoreService.getPony(id),
            this.configService.pony,
          );
          break;
        case 'beast':
          embed = await this.getEmbed(
            await this.dataStoreService.getBeast(id),
            this.configService.beast,
          );
          break;
        case 'spawn':
          embed = await this.getEmbed(
            await this.dataStoreService.getSpawn(id),
            this.configService.spawn,
          );
          break;
        case 'lock':
          embed = await this.getEmbed(
            await this.dataStoreService.getLock(id),
            this.configService.lock,
          );
          break;
        default:
          if (await this.dataStoreService.checkSoul(id)) {
            embed = await this.getEmbed(
              await this.dataStoreService.getSoul(id),
              this.configService.soul,
            );
          } else {
            const wizard: Wizard = await this.dataStoreService.getWizard(id);
            wizard.traits = this.dataStoreService.getWizardFields(wizard);
            embed = await this.getEmbed(wizard, this.configService.wizard);
          }
          break;
      }
      if (embed === undefined) {
        return;
      }
      try {
        this._logger.log(`Posting ${collection} (${id})`);
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
  public async getEmbed(i: Item, c: CollectionConfig): Promise<MessageEmbed> {
    if (i === undefined) {
      return;
    }
    return new MessageEmbed()
      .setColor(i.backgroundColor)
      .setAuthor(
        `${i.name} (#${i.serial})`,
        'https://cdn.discordapp.com/app-icons/843121928549957683/af28e4f65099eadebbb0635b1ea8d0b2.png?size=64',
        `${c.openSeaBaseURI}/${i.serial}`,
      )
      .setURL(
        `${this.configService.bot.forgottenBaseURI}/${c.tokenContract}/${i.serial}`,
      )
      .setThumbnail(`${c.imageURI}/${i.serial}.png`)
      .addFields(i.traits);
  }
}
