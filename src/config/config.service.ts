import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiscordConfig,
  EthereumConfig,
  TwitterConfig,
  WizardsConfig,
} from '../types';
import { TwitterOptions } from 'twitter-lite';

@Injectable()
export class AppConfigService {
  constructor(protected readonly configService: ConfigService) {}

  /**
   * Wizard config
   */
   public get wizards(): WizardsConfig {
    return this.configService.get<WizardsConfig>('wizards');
  }

  /**
   * Discord config
   */
  public get discord(): DiscordConfig {
    return this.configService.get<DiscordConfig>('discord');
  }

  /**
   * Ethereum client config
   */
  public get ethereum(): EthereumConfig {
    return this.configService.get<EthereumConfig>('ethereum');
  }

  /**
   * Twitter config
   */
  public get twitter(): TwitterOptions {
    const config = this.configService.get<TwitterConfig>('twitter');
    return {
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: config.accessTokenKey,
      access_token_secret: config.accessTokenSecret,
    };
  }

  /**
   * Is development
   */
  public get isDevelopment(): boolean {
    return process.env.APP_ENVIRONMENT == 'development' ? true : false
  }

  /**
   * Development channel
   */
  //public get devChannel(); number {
  //  return process.env.DISCORD_DEVELOPMENT_CHANNEL
  //}
}
