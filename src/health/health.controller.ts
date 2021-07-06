import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import {
  HttpHealthIndicator,
  HealthCheckService,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: HttpHealthIndicator,
  ) {}

  @Get('healthz')
  @HealthCheck()
  healthCheck(): any {
    return this.health.check([
      async (): Promise<any> => this.dns.pingCheck('dns', 'https://google.com'),
    ]);
  }

  @Get('error')
  errorTest(): any {
    throw new HttpException('Test Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
