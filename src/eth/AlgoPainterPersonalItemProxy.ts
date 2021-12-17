import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterPersonalItem from './AlgoPainterPersonalItem.json';
import { getPersonalItemContractByNetworkId } from './Config';

export default class AlgoPainterPersonalItemProxy {
  declare smartContract: {
    methods: {
        mint(
          name: string,
          imageHash: string,
          creatorPercentage: number,
          tokenURI: string,
        ): ContractSendMethod;
        getCurrentAmount(
          algoPainterId: number,
          supply: number,
        ): ContractSendMethod;
      };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getPersonalItemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
        AlgoPainterPersonalItem as AbiItem[],
        contractAddress,
    );
  }

  mint(
    name: string,
    imageHash: string,
    creatorPercentage: number,
    tokenURI: string,
    from: string,
  ) {
    return this.smartContract.methods.mint(
      name,
      imageHash,
      creatorPercentage,
      tokenURI,
    ).send({ from });
  }

  async getCurrentAmount(
    algoPainterId: number,
    supply: number,
  ) {
    const response: unknown = await this.smartContract.methods.getCurrentAmount(
      algoPainterId,
      supply,
    ).call();
    return response as number;
  }
}
