import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from './discord';
import { TwitterService } from './twitter';
//import { CronJob } from 'cron';
//import { EthereumService } from './ethereum';
//import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
//import { CronJobs, DailyTweet } from './types';

@Injectable()
export class AppService {
  private readonly _logger = new Logger(AppService.name);

  get name(): string {
    return 'RuneBot';
  }

  constructor(
    private readonly _discord: DiscordService,
    private readonly _twitter: TwitterService,
    //private readonly _schedulerRegistry: SchedulerRegistry,
    //private readonly _ethereum: EthereumService,
  ) {

    


    //const dailyTweet = new CronJob(
    //  CronExpression.EVERY_DAY_AT_NOON,
    //  async () => {
    //    const data: DailyTweet = {}
    //    // todo get data
    //    this._twitter.tweet(data);
    //    this._logger.log(`Running Job (Daily Tweet) `);
    //  },
    //);

    //this._schedulerRegistry.addCronJob(CronJobs.WIZARD_TWEET, dailyTweet);
    //dailyTweet.start();
    //this._logger.log(
    //  `Supply monitoring cron job started. Cron pattern: ${CronExpression.EVERY_5_MINUTES}`,
    //);
    //supplyTweet.start();
    //this._logger.log(
    //  `Supply tweeting cron job started. Cron pattern: ${CronExpression.EVERY_DAY_AT_NOON}`,
    //);
  }
}
