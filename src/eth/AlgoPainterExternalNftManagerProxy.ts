import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterExternalNftManager from './AlgoPainterExternalNftManager.json';
import { getExternalNftManagerContractByNetworkId } from './Config';
import { PromiEvent } from 'web3-core';
import { Contract } from 'web3-eth-contract';

export default class AlgoPainterExternalNftManagerProxy {
  declare smartContract: {
    methods: {
      registerNFTContract (
        contractAddress: string,
        tokenIds: number[],
        creatorRate: number
      ): ContractMethod;
      registerTokens(
        contractAddress: string,
        tokenIds: number[]
      ): ContractMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const externalNftManagerAddress = getExternalNftManagerContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterExternalNftManager as AbiItem[],
      // storageContractAddress,
      externalNftManagerAddress
    );
  }

  registerNFTContract(
    contractAddress: string,
    tokenIds: number[],
    creatorRate: number,
    account: string
  ) : PromiEvent<Contract> {
    return this.smartContract.methods.registerNFTContract(
      contractAddress,
      tokenIds,
      creatorRate
    ).send({ from: account });
  }

  registerTokens(
    contractAddress: string,
    tokenIds: number[],
    account: string
  ) : PromiEvent<Contract> {
    return this.smartContract.methods.registerTokens(
      contractAddress,
      tokenIds
    ).send({ from: account });
  }
}