import AlgoPainterTokenProxy from '../eth/AlgoPainterTokenProxy';
import { NetworkInfo } from '../store/user/types';

const fetchAccountBalance = async(networkInfo: NetworkInfo, accountAddress: string) => {
  const algopainter = new AlgoPainterTokenProxy(networkInfo);
  return (await algopainter.balanceOf(accountAddress)) as string;
};

export { fetchAccountBalance };
