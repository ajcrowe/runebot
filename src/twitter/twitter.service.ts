import { Injectable, Logger } from '@nestjs/common';
import Twitter from 'twitter-lite';
import { AppConfigService } from '../config';
import { DailyTweet } from '../types';

@Injectable()
export class TwitterService {
  private readonly _logger = new Logger(this.name);
  private readonly twitter: Twitter;

  get name(): string {
    return 'TwitterService';
  }

  constructor(protected readonly configService: AppConfigService) {
    this.twitter = new Twitter(this.configService.twitter);
  }

  /**
   * Tweet daily Wizard data
   * @param data populated tweet data object
   */
  public async tweet(data: DailyTweet): Promise<any> {
    const status = this.formatTweet(data);
    if (!this.configService.isDevelopment) {
      try {
        await this.twitter.post('statuses/update', { status });
        this._logger.log(`Tweeted:\n ${status}`);
      } catch (err) {
        this._logger.error(err);
      }
    } else {
      console.log(status);
    }
  }

  /**
   * Format the status update using the data
   * @param data populated supply data object
   */
  formatTweet(data: DailyTweet): string {
    //todo
    console.log(data);
    return `tweet...`
  }
}
