import { IWalletConnectProviderOptions } from '@walletconnect/types';

export default function getAlgoPainterContractByNetworkId(id: number) {
  switch (id) {
    case 56:
      return '0xbee554dbbc677eb9fb711f5e939a2f2302598c75';
    case 97:
      return '0x01A9188076f1231dF2215F67b6A63231fE5e293E';
    default:
      break;
  }
}

export function getWalletConnectConfig(): IWalletConnectProviderOptions {
  if (process.env.NODE_ENV === 'production') {
    return {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
      },
      chainId: 56,
    };
  } else {
    return {
      rpc: {
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      chainId: 97,
    };
  }
}
