import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { AppConfigModule } from '../config';
import { DataStoreModule } from '../datastore';

describe('DiscordService', () => {
  let service: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, DataStoreModule],
      providers: [DiscordService],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
