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
      //this._salesChannel = await this._client.channels.fetch(salesChannelId) as TextChannel;
    });
    this.channelWatcher();
  }

  /*
   * Send sale notification to sale channel
   */

  public async sendSale(message: MessageEmbed): Promise<void> {
    try {
      //this._salesChannel.send();
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