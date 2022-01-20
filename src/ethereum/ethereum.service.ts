import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { AppConfigService } from '../config';
import { ethers } from 'ethers';
import soulAbi from './abis/souls.json'

@Injectable()
export class EthereumService {
  private readonly _logger = new Logger(EthereumService.name);
  private readonly provider: WebSocketProvider;

  get name(): string {
    return 'EthereumService';
  }

  constructor(protected readonly configService: AppConfigService) {
    const { url, network } = this.configService.ethereum;
    this.provider = new WebSocketProvider(url, network);
  }

  public async getSoulIds(): Promise<Array<number>> {
    let ids: Array<number>

    const contract = new ethers.Contract(
      this.configService.soul.tokenContract,
      soulAbi,
      this.provider,
    );
    const txns = await contract.queryFilter(
      contract.filters.Transfer('0x0000000000000000000000000000000000000000', null),
      13512483
    );

    //console.log(txns);

    for (const txn of txns) {
      ids.push(txn.args.tokenId);
    }

    return ids;
  }
}