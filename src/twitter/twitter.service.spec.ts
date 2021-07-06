import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from './twitter.service';
import { AppConfigModule } from '../config';

describe('TwitterService', () => {
  let service: TwitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [TwitterService],
    }).compile();

    service = module.get<TwitterService>(TwitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
