import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';
import ERC721Stub from './ERC721Stub.json';

export default class ERC721StubProxy {
  declare erc721StubContract: {
    methods: {
      name(): ContractSendMethod;
      symbol(): ContractSendMethod;
      balanceOf(
        address: string
      ): ContractSendMethod;
      tokenOfOwnerByIndex(
        addres: string,
        index: number
      ): ContractSendMethod;
      tokenURI(
        tokenId: number
      ): ContractSendMethod;
    };
  };

  constructor(
    contractAddress: string
  ) {
    this.erc721StubContract = new window.web3.eth.Contract(
      ERC721Stub as AbiItem[],
      contractAddress
    );
  }

  async name(): Promise<string> {
    const response: unknown = await this.erc721StubContract.methods.name().call();

    return response as string;
  }

  async symbol(): Promise<string> {
    const response: unknown = await this.erc721StubContract.methods.symbol().call();

    return response as string;
  }

  async balanceOf(
    address: string
  ): Promise<number> {
    const response: unknown = await this.erc721StubContract.methods.balanceOf(
      address
    ).call();

    return response as number;
  }

  async tokenOfOwnerByIndex(
    address: string,
    index: number
  ): Promise<number> {
    const response: unknown = await this.erc721StubContract.methods.tokenOfOwnerByIndex(
      address,
      index
    ).call();

    return response as number;
  }

  async tokenURI(
    tokenId: number
  ): Promise<string> {
    const response: unknown = await this.erc721StubContract.methods.tokenURI(
      tokenId
    ).call();

    return response as string;
  }
}
