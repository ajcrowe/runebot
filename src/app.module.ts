import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthModule } from './health';
import { TwitterModule } from './twitter';
import { DiscordModule } from './discord/discord.module';
import { ScheduleModule } from '@nestjs/schedule';
//import { EthereumModule } from './ethereum';

@Module({
  imports: [
    HealthModule,
    TwitterModule,
    DiscordModule,
    ScheduleModule.forRoot(),
    //EthereumModule,
  ],
  providers: [AppService],
})
export class AppModule {}
