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

export function getAuctionSystemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_56 as string;
    case 97:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97 as string;
    default:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS as string;
  }
}

export function getRewardsSystemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM_56 as string;
    case 97:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM_97 as string;
    default:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM as string;
  }
}

export function getBidBackPirsContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT_56 as string;
    case 97:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT_97 as string;
    default:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT as string;
  }
}
