import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { AppConfigService } from '../config';
import { ethers, Contract } from 'ethers';

@Injectable()
export class EthereumService {
  private readonly _logger = new Logger(EthereumService.name);
  private readonly provider: WebSocketProvider;
  private readonly contract: Contract;

  get name(): string {
    return 'EthereumService';
  }

  constructor(protected readonly configService: AppConfigService) {
    //const { url, network } = this.configService.ethereum;
    //this.provider = new WebSocketProvider(url, network);
    //this.contract = new ethers.Contract(
    //  this.configService.wizards.tokenContract,
    //  Wizards.abi,
    //  this.provider,
    //);
  }
}