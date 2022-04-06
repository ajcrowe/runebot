import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthModule } from './health';
import { TwitterModule } from './twitter';
import { DiscordModule } from './discord/discord.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from './config';
import { EthereumModule } from './ethereum';
import { CacheModule } from './cache';

@Module({
  imports: [
    AppConfigModule,
    HealthModule,
    TwitterModule,
    DiscordModule,
    EthereumModule,
    ScheduleModule.forRoot(),
    CacheModule,
  ],
  providers: [AppService],
})
export class AppModule {}
