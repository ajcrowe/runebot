import { Controller } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller()
export class EthereumController {
  constructor(
    private readonly service: EthereumService,
  ) {}

}
