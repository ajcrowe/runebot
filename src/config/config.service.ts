import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BotConfig,
  DiscordConfig,
  EthereumConfig,
  TwitterConfig,
  CollectionConfig,
} from '../types';
import { TwitterOptions } from 'twitter-lite';

@Injectable()
export class AppConfigService {
  constructor(protected readonly configService: ConfigService) {}

  /**
   * Bot config
   */
  public get bot(): BotConfig {
    return this.configService.get<BotConfig>('bot');
  }

  /**
   * Wizard config
   */
  public get wizard(): CollectionConfig {
    return this.configService.get<CollectionConfig>('wizard');
  }

  /**
   * Soul config
   */
  public get soul(): CollectionConfig {
    return this.configService.get<CollectionConfig>('soul');
  }

  /**
   * Warrior config
   */
  public get warrior(): CollectionConfig {
    return this.configService.get<CollectionConfig>('warrior');
  }

  /**
   * Pony config
   */
  public get pony(): CollectionConfig {
    return this.configService.get<CollectionConfig>('pony');
  }

  /**
   * Flame config
   */
  public get flame(): CollectionConfig {
    return this.configService.get<CollectionConfig>('flame');
  }

  /**
   * Lock config
   */
  public get lock(): CollectionConfig {
    return this.configService.get<CollectionConfig>('lock');
  }

  /**
   * Beast config
   */
  public get beast(): CollectionConfig {
    return this.configService.get<CollectionConfig>('beast');
  }

  /**
   * Spawn config
   */
  public get spawn(): CollectionConfig {
    return this.configService.get<CollectionConfig>('spawn');
  }

  /**
   * Babies config
   */
  public get babies(): CollectionConfig {
    return this.configService.get<CollectionConfig>('babies');
  }

  /**
   * Rings config
   */
  public get rings(): CollectionConfig {
    return this.configService.get<CollectionConfig>('rings');
  }

  /** 
   * Items config
   */
  public get runiverseItems(): CollectionConfig {
    return this.configService.get<CollectionConfig>('runiverseitems');
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
    return process.env.APP_ENVIRONMENT == 'development' ? true : false;
  }

  /**
   * Development channel
   */
  //public get devChannel(); number {
  //  return process.env.DISCORD_DEVELOPMENT_CHANNEL
  //}
}
