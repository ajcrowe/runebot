import { Controller, Get, Query } from '@nestjs/common';
import { DataStoreService } from './datastore.service';
import { Wizard } from '../types';

@Controller()
export class DataStoreController {
  constructor(private readonly service: DataStoreService) {}

  @Get('wizard')
  async getWizard(@Query('id') id: string): Promise<Wizard> {
    return await this.service.getWizard(id);
  }
}
