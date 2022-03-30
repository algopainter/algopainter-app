import { IWalletConnectProviderOptions } from '@walletconnect/types';

//@TODO - We want the API to find the correct values based on USER network, but to do this we may want to send credentiasl via API headers

export default function getAlgoPainterContractByNetworkId(id: number) : string {
  switch (id) {
    case 56:
      return '0xbee554dbbc677eb9fb711f5e939a2f2302598c75';
    case 97:
      return '0x01A9188076f1231dF2215F67b6A63231fE5e293E';
    default:
      return '';
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

export function getArtistCollectionAddress(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_ARTIST_COLLECTION_CONTRACT as string;
    case 97:
      return process.env.ALGOPAINTER_ARTIST_COLLECTION_CONTRACT as string;
    default:
      return process.env.ALGOPAINTER_ARTIST_COLLECTION_CONTRACT as string;
  }
}

export function getArtistCollectionItemAddress(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_ARTIST_COLLECTION_ITEM_CONTRACT as string;
    case 97:
      return process.env.ALGOPAINTER_ARTIST_COLLECTION_ITEM_CONTRACT as string;
    default:
      return process.env.ALGOPAINTER_ARALGOPAINTER_ARTIST_COLLECTION_ITEM_CONTRACTTIST_COLLECTION_CONTRACT as string;
  }
}

export function getAuctionSystemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97 as string;
    case 97:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97 as string;
    default:
      return process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97 as string;
  }
}

export function getRewardsSystemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM_97 as string;
    case 97:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM_97 as string;
    default:
      return process.env.ALGOPAINTER_REWARDS_SYSTEM_97 as string;
  }
}

export function getBidBackPirsContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT_97 as string;
    case 97:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT_97 as string;
    default:
      return process.env.ALGOPAINTER_BIDBACK_PIRS_CONTRACT_97 as string;
  }
}

export function getPersonalItemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_PERSONAL_ITEM_CONTRACT_97 as string;
    case 97:
      return process.env.ALGOPAINTER_PERSONAL_ITEM_CONTRACT_97 as string;
    default:
      return process.env.ALGOPAINTER_PERSONAL_ITEM_CONTRACT_97 as string;
  }
}

export function getGweiItemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_GWEI_ITEM_CONTRACT_97 as string;
    case 97:
      return process.env.ALGOPAINTER_GWEI_ITEM_CONTRACT_97 as string;
    default:
      return process.env.ALGOPAINTER_GWEI_ITEM_CONTRACT_97 as string;
  }
}

export function getExpressionItemContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.ALGOPAINTER_EXPRESSION_ITEM_CONTRACT_97 as string;
    case 97:
      return process.env.ALGOPAINTER_EXPRESSION_ITEM_CONTRACT_97 as string;
    default:
      return process.env.ALGOPAINTER_EXPRESSION_ITEM_CONTRACT_97 as string;
  }
}

export function getAlgopTokenContractByNetworkId(id: number): string {
  switch (id) {
    case 56:
      return process.env.VUE_APP_ALGOP_TOKEN_ADDRESS as string;
    case 97:
      return process.env.VUE_APP_ALGOP_TOKEN_ADDRESS as string;
    default:
      return process.env.VUE_APP_ALGOP_TOKEN_ADDRESS as string;
  }
}
