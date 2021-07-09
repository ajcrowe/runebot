import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from './discord';
import { CronJob } from 'cron';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJobs } from './types';
//import { TwitterService } from './twitter';
//import { EthereumService } from './ethereum';

@Injectable()
export class AppService {
  private readonly _logger = new Logger(AppService.name);

  get name(): string {
    return 'RuneBot';
  }

  constructor(
    private readonly _discord: DiscordService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    //private readonly _twitter: TwitterService,
    //private readonly _ethereum: EthereumService,
  ) {

    const salesChecker = new CronJob(
      CronExpression.EVERY_MINUTE, async () => {
      this._logger.log(`Running Sales Checker Job`);
      this._discord.checkSales();
    });

    this._schedulerRegistry.addCronJob(CronJobs.SALES_CHECKER, salesChecker);
    salesChecker.start();
    this._logger.log(
      `Sales checker cron job started. Cron pattern: ${CronExpression.EVERY_MINUTE}`,
    );
  }
}
