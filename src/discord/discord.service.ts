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

  public async checkSales(): Promise<void> {
    try {
      const timestamp = new Date(Date.now() - (900 * 1000));
      const url = `https://api.opensea.io/api/v1/events?collection_slug=${this.configService.wizards.openSeaSlug}&event_type=successful&only_opensea=false&offset=0&limit=100&occurred_after=${timestamp.toISOString()}`;
      const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-KEY': this.configService.bot.openSeaApiKey}};

      try {
        const response = await fetch(url, options)
        const sales = await response.json()
        for (const sale of sales.asset_events) {
          if (!this._recentTransactions.includes(sale.transaction.transaction_hash)) {
            const embed = new MessageEmbed()
              .setColor(sale.asset.backgroundColor)
              .setTitle(`New Sale: ${sale.asset.name}`)
              .setURL(`${this.configService.wizards.openSeaBaseURI}/${sale.asset.token_id}`)
              .setThumbnail(`${this.configService.wizards.ipfsBaseURI}/${sale.asset.token_id}.png`)
              .addFields([
                {
                  name: 'Serial',
                  value: `${sale.asset.token_id}`
                },
                {
                  name: 'Amount',
                  value: `${(sale.total_price / 1000000000000000000)} ${sale.payment_token.symbol} ($${((sale.total_price / 1000000000000000000) * sale.payment_token.usd_price).toFixed(2)} USD)`,
                  inline: false
                },
                {
                  name: 'Seller',
                  value: `[${sale.seller.address.slice(0, -34)}](https://opensea.io/accounts/${sale.seller.address}) (${sale.seller.user.username})`,
                  inline: true,
                },
                {
                  name: 'Buyer',
                  value: `[${sale.winner_account.address.slice(0, -34)}](https://opensea.io/accounts/${sale.winner_account.address}) (${sale.winner_account.user.username})`,
                  inline: true
                },
              ])

            for (const channel of this._salesChannels) {
              channel.send(embed);
            }
            this._recentTransactions.push(sale.transaction.transaction_hash);

            if (this._recentTransactions.length > 100) {
              this._recentTransactions = this._recentTransactions.slice(Math.max(this._recentTransactions.length - 100, 0))
            }
          }
        }
      } catch(error) {
        this._logger.error(`error fetching sales from OpenSea: ${error}`);
      }

    } catch (err) {
      this._logger.error(err);
    }
  }

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
}