import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config';
import Discord, { TextChannel, MessageEmbed } from 'discord.js';
import toRegexRange from 'to-regex-range';
import { Wizard } from 'src/types';
import { DataStoreService } from '../datastore';
import fetch from 'node-fetch';


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
    protected readonly dataStoreService: DataStoreService
  ) {
    const { token, salesChannelIds } = this.configService.discord
    this._client.login(token);
    this._client.on('ready', async () => {
      this._salesChannels = [];
      for (const channelId of salesChannelIds) {
        this._salesChannels.push(await this._client.channels.fetch(channelId) as TextChannel);
      }
      this._recentTransactions = [];
    });
    this.channelWatcher();
  }

  /*
   * Send sale notification to sale channel
   */

  public async checkWizardSales(): Promise<void> {
    const sales = await this.getSales(this.configService.wizards.openSeaSlug)
    for (const sale of sales.asset_events) {
      if (!this._recentTransactions.includes(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`)) {
        const fields = [{name: 'Serial', value: sale.asset.token_id}, ...this.getStandardFields(sale)]
        const embed = new MessageEmbed()
          .setColor(sale.asset.background_color)
          .setTitle(`New Sale: ${sale.asset.name}`)
          .setURL(`${this.configService.wizards.openSeaBaseURI}/${sale.asset.token_id}`)
          .setThumbnail(`${this.configService.wizards.ipfsBaseURI}/${sale.asset.token_id}.png`)
          .addFields(fields)

        for (const channel of this._salesChannels) {
          channel.send(embed);
        }
        this._recentTransactions.push(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`);

        if (this._recentTransactions.length > 100) {
          this._recentTransactions = this._recentTransactions.slice(Math.max(this._recentTransactions.length - 100, 0))
        }
      }
    }
  }

  /*
  * Check for flame sales
  */
  public async checkFlameSales(): Promise<void> {
    const sales = await this.getSales(this.configService.wizards.openSeaFlameSlug)
    for (const sale of sales.asset_events) {
      if (!this._recentTransactions.includes(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`)) {
        const embed = new MessageEmbed()
          .setColor(sale.asset.background_color)
          .setTitle(`New Sale: ${sale.asset.name}`)
          .setURL(sale.asset.permalink)
          .setThumbnail(`https://github.com/ajcrowe/runebot/raw/master/assets/flame.png`)
          .addFields(this.getStandardFields(sale))

        for (const channel of this._salesChannels) {
          channel.send(embed);
        }
        this._recentTransactions.push(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`);

        if (this._recentTransactions.length > 100) {
          this._recentTransactions = this._recentTransactions.slice(Math.max(this._recentTransactions.length - 100, 0))
        }
      }
    }
  }

/*
  * Check for soul sales
  */
public async checkSoulSales(): Promise<void> {
  const sales = await this.getSales(this.configService.wizards.openSeaSoulSlug)
  console.log(sales);
  for (const sale of sales.asset_events) {
    if (!this._recentTransactions.includes(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`)) {
      const embed = new MessageEmbed()
        .setColor(sale.asset.background_color)
        .setTitle(`New Sale: ${sale.asset.name}`)
        .setURL(sale.asset.permalink)
        .setThumbnail(`https://portal.forgottenrunes.com/api/souls/img/${sale.asset.token_id}.png`)
        .addFields(this.getStandardFields(sale))

      for (const channel of this._salesChannels) {
        channel.send(embed);
      }
      this._recentTransactions.push(`${sale.transaction.transaction_hash}:${sale.asset.token_id}`);

      if (this._recentTransactions.length > 100) {
        this._recentTransactions = this._recentTransactions.slice(Math.max(this._recentTransactions.length - 100, 0))
      }
    }
  }
}

  /*
   * Get sales for specific collection
   */

  public async getSales(collection: string): Promise<any> {
    try {
      const timestamp = new Date(Date.now() - (Number(this.configService.bot.salesLookbackSeconds) * 1000)).toISOString();
      const url = `https://api.opensea.io/api/v1/events?collection_slug=${collection}&event_type=successful&only_opensea=false&offset=0&limit=100&occurred_after=${timestamp}`;
      const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-KEY': this.configService.bot.openSeaApiKey}};
      const response = await fetch(url, options)
      return response.json()
    } catch(err) {
      this._logger.error(err);
    }
  }

  /*
   * watch channel for requests for data
   */
  public async channelWatcher(): Promise<void> {
    const { prefix } = this.configService.discord
    this._client.on("message", async (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
      if (this.configService.isDevelopment) {
        if (message.channel.id != '843121547358109700') return;
      }

      const commandBody = message.content.slice(prefix.length);
      const args = commandBody.split(' ');
      const command = args.shift().toLowerCase();

      if (this._rangeRegex.test(command)) {

        const wizard: Wizard = await this.dataStoreService.getWizard(command)
        this._logger.log(`Fetched Wizard: ${wizard.name} (${command})`);

        const fields = this.dataStoreService.getWizardFields(wizard);

        const embed = new MessageEmbed()
          .setColor(wizard.backgroundColor)
          .setAuthor(`#${wizard.serial} ${wizard.name}`, 'https://cdn.discordapp.com/app-icons/843121928549957683/af28e4f65099eadebbb0635b1ea8d0b2.png?size=64', `${this.configService.wizards.openSeaBaseURI}/${wizard.serial}`)
          .setURL(`${this.configService.wizards.openSeaBaseURI}/${wizard.serial}`)
          .setThumbnail(`${this.configService.wizards.ipfsBaseURI}/${wizard.serial}.png`)
          .addFields(fields)
        
        try {
          message.reply({embed: embed});
        } catch(error) {
          this._logger.error(`error posting wizard ${command}, ${error}`)
          return
        }
      } else {
        this._logger.log(`Wizard out of range`)
        return
      }
    });
  }

  /*
   * get standard fields for each sale
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public getStandardFields(sale: any): any[] {
    const sellerName = (sale.seller.user && sale.seller.user.username) ? `(${sale.seller.user.username})` : ``
    const winnerName = (sale.winner_account.user && sale.winner_account.user.username) ? `(${sale.winner_account.user.username})` : ``
    const price = sale.total_price / (10 ** sale.payment_token.decimals)
    return [{
      name: 'Amount',
      value: `${price} ${sale.payment_token.symbol} ($${(price * sale.payment_token.usd_price).toFixed(2)} USD)`,
      inline: false
    },
    {
      name: 'Seller',
      value: `[${sale.seller.address.slice(0, -34)}](https://opensea.io/accounts/${sale.seller.address}) ${sellerName}`,
      inline: true,
    },
    {
      name: 'Buyer',
      value: `[${sale.winner_account.address.slice(0, -34)}](https://opensea.io/accounts/${sale.winner_account.address}) ${winnerName}`,
      inline: true
    }]
  }
}