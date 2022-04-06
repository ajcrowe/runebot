import axios, { AxiosResponse } from 'axios';
import { DefaultOptions } from '@apollo/client/core';
import { Logger } from '@nestjs/common';

export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  public apolloDefaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  get name(): string {
    return 'MarketService';
  }

  public async sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get Currency Price
   */
  public async getPrice(token: string, currency: string): Promise<number> {
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=${currency}`,
        {
          method: 'get',
          headers: {
            Accept: 'application/json',
          },
          timeout: 5000,
          transformResponse: [
            function transformResponse(data) {
              return JSON.parse(data);
            },
          ],
        },
      );
      this.logger.debug(
        `Fetched price ${token}/${currency}: ${response.data[token][currency]}`,
      );
      return response.data[token][currency];
    } catch (err) {
      this.logger.error(err);
    }
  }
}
