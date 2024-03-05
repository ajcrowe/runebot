import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from './discord';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJobs } from './types';
import { AppConfigService } from './config';
//import { TwitterService } from './twitter';
//import { EthereumService } from './ethereum';

@Injectable()
export class AppService {
  private readonly _logger = new Logger(AppService.name);

  get name(): string {
    return 'RuneBot';
  }

  constructor(
    protected readonly configService: AppConfigService,
    private readonly _discord: DiscordService,
    private readonly _schedulerRegistry: SchedulerRegistry, //private readonly _twitter: TwitterService, //private readonly _ethereum: EthereumService,
  ) {
    const salesChecker = new CronJob(
      this.configService.bot.salesCheckCron,
      async () => {
        this._logger.log(`Running Sales Checker Job`);
        this._discord.checkSales([
          this.configService.wizard,
          this.configService.soul,
          this.configService.warrior,
          this.configService.pony,
          this.configService.flame,
          this.configService.lock,
          this.configService.beast,
          this.configService.spawn,
          this.configService.rings,
          this.configService.runiverseItems,
          this.configService.athenaeum,
        ]);

        this._logger.log(`Running Listings Checker Job`);
        this._discord.checkListings([
          this.configService.wizard,
          this.configService.soul,
          this.configService.warrior,
          this.configService.pony,
          this.configService.flame,
          this.configService.lock,
          this.configService.beast,
          this.configService.spawn,
          this.configService.rings,
          this.configService.runiverseItems,
          this.configService.athenaeum,
        ]);
      },
    );

    this._schedulerRegistry.addCronJob(CronJobs.SALES_CHECKER, salesChecker);
    salesChecker.start();
    this._logger.log(
      `Marketplace checker cron job started. Cron pattern: ${this.configService.bot.salesCheckCron}`,
    );
  }
}
