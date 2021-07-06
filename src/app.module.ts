import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthModule } from './health';
import { TwitterModule } from './twitter';
import { DiscordModule } from './discord/discord.module';
//import { EthereumModule } from './ethereum';
//import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HealthModule,
    TwitterModule,
    DiscordModule,
    //EthereumModule,
    //ScheduleModule.forRoot(),
  ],
  providers: [AppService],
})
export class AppModule {}
