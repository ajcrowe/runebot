import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config';
import Discord, { TextChannel, MessageEmbed } from 'discord.js';
import toRegexRange from 'to-regex-range';
import { Wizard } from 'src/types';
import { DataStoreService } from '../datastore';


@Injectable()
export class DiscordService {
  private readonly _logger = new Logger(DiscordService.name);
  private readonly _client = new Discord.Client();
  private readonly _rangeRegex = new RegExp(`^${toRegexRange('1', '10000')}$`);

  protected _salesChannel: TextChannel;
  protected _recentTransactions: Array<String>;

  get name(): string {
    return 'DiscordService';
  }

  constructor(
    protected readonly configService: AppConfigService,
    protected readonly dataStoreService: DataStoreService
  ) {
    const { token, salesChannelId } = this.configService.discord
    this._client.login(token);
    this._client.on('ready', async () => {
      this._salesChannel = await this._client.channels.fetch(salesChannelId) as TextChannel;
      this._recentTransactions = [];
      this.sendSale();
    });
    this.channelWatcher();

  }

  /*
   * Send sale notification to sale channel
   */

  public async sendSale(): Promise<void> {
    try {
      const timestamp = new Date(Date.now() - (5000 * 60));
      const fetch = require('node-fetch');
      const url = `https://api.opensea.io/api/v1/events?collection_slug=forgottenruneswizardscult&event_type=successful&only_opensea=false&offset=0&limit=20&occurred_after=${timestamp.toISOString()}`;
      const options = {method: 'GET', headers: {Accept: 'application/json'}};

      var response;

      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          const wizards = json.asset_events.reverse();
          wizards.forEach((event) => { 
            if (this._recentTransactions.indexOf(event.transaction.transaction_hash) == -1) {
              const embed = new MessageEmbed()
            .setColor(event.asset.backgroundColor)
            .setTitle(`✨ Wizard #${event.asset.token_id} sold for ${(event.total_price / 1000000000000000000)} ${event.payment_token.symbol}!`)
            .setDescription(`${event.asset.name}`)
            .setURL(`${this.configService.wizards.openSeaBaseURI}/${event.asset.token_id}`)
            .setThumbnail(`${this.configService.wizards.ipfsBaseURI}/${event.asset.token_id}.png`);

            this._salesChannel.send(embed);
            this._recentTransactions.push(event.transaction.transaction_hash);

            if (this._recentTransactions.length > 5) {
              this._recentTransactions = this._recentTransactions.slice(Math.max(this._recentTransactions.length - 5, 0))
            }
            console.log(this._recentTransactions);
        }
           } );
        })
        .catch(err => console.error('error:' + err));

      setTimeout(this.sendSale, 10000);

    } catch (err) {
      this._logger.error(err);
    }
  }

  public async channelWatcher(): Promise<void> {
    const { prefix } = this.configService.discord
    this._client.on("message", async (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
      //if (message.channel.id != '843121547358109700') return;

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