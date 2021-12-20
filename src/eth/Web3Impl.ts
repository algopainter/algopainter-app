import { ContractSendMethod, CallOptions } from 'web3-eth-contract';

export interface ContractMethod extends ContractSendMethod {
  call<TReturn>(
    options?: CallOptions,
    callback?: (err: Error, result: TReturn) => void
  ): Promise<TReturn>;
}