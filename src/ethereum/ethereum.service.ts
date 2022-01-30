import { Injectable, Logger } from '@nestjs/common';
import { WebSocketProvider } from '@ethersproject/providers';
import { AppConfigService } from '../config';
import { ethers, utils } from 'ethers';
//import soulAbi from './abis/souls.json';
import { CollectionConfig } from 'src/types';
import fs from 'fs';

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

  public async getCollectionIds(c: CollectionConfig): Promise<Array<number>> {
    const rawdata = await fs.readFileSync(c.tokenAbi);
    const abi = await JSON.parse(rawdata.toString());

    let ids: Array<number>;

    const contract = new ethers.Contract(c.tokenContract, abi, this.provider);
    const txns = await contract.queryFilter(
      contract.filters.Transfer(
        '0x0000000000000000000000000000000000000000',
        null,
      ),
      13512483,
    );

    //console.log(txns);

    for (const txn of txns) {
      ids.push(txn.args.tokenId);
    }

    return ids;
  }

  public async getOwner(c: CollectionConfig, id: string): Promise<string> {
    const rawdata = await fs.readFileSync(`./${c.tokenAbi}`);
    const abi = await JSON.parse(rawdata.toString());

    const contract = new ethers.Contract(c.tokenContract, abi, this.provider);
    const owner = await contract.ownerOf(Number(id));

    return owner;
  }

  public async getDomain(address: string): Promise<string> {
    const domain = await this.provider.lookupAddress(utils.getAddress(address));
    this._logger.debug(`${address} resolves to ${domain}`);
    return domain != null ? domain : ``;
  }
}
