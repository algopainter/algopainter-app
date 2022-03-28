import { IBid } from './IBid';
import moment from 'moment';

export interface IAuctionItem {
  address?: string;
  bidbacks: { [key: string]: number };
  bidbackshare: { [key: string]: number };
  pirs: { [key: string]: number };
  pirshare: { [key: string]: number };
  _id: string;
  index: number;
  bids: IBid[];
  categories: string[];
  createdAt: string;
  expirationDt: string;
  fee: {
    bidbackRate: number;
    service: number;
  };
  highestBid: IBid;
  isHot: boolean;
  ended: boolean;
  item: {
    collectionName: string;
    collectionOwner: string;
    description: string;
    image: string;
    index: number;
    sequentialNumber?: number;
    previewImage: string;
    rawImage: string;
    title: string;
    _id: string;
  };
  lowestBid: {
    amount: number;
    bidder: {
      account: string;
      avatar: string;
      bio: string;
      createdAt: string;
      name: string;
      networks: {
        name: string;
        type: string;
        url: string;
      };
      role: string;
      type: string;
      updatedAt: string;
      _id: string;
    };
    createdAt: string;
    tokenSymbol: string;
  };
  likers: string[];
  likes: number;
  minimumBid: {
    amount: number;
    createdAt: string;
    tokenSymbol: string;
    tokenPriceAddress: string;
  };
  returns: {
    [account: string]: number;
  };
  owner: string;
  startDt: string;
  updatedAt: string;
  users: [
    {
      account: string;
      avatar: string;
      bio: string;
      createdAt: string;
      name: string;
      customProfile: string;
      networks: {
        name: string;
        type: string;
        url: string;
      };
      role: string;
      type: string;
      updatedAt: string;
      _id: string;
    }
  ];
}

//Vue cannot handle enums properly
export const EnumBidStatus = {
  Winning : 1, //The current account is winning the auction
  OutBidded : 2, //The current account has been outbidded and the action still running
  Winner : 3, //The current account won the auction,
  EndedWithdraw : 4, //The current account won the auction,
};

export function isExpired(auction: IAuctionItem) {
  return moment(auction.expirationDt).unix() <= moment().unix();
}

export function isEnded(auction: IAuctionItem) {
  return auction.ended;
}

export function bidStatus(auction: IAuctionItem, account: string): number {
  if (auction.highestBid.account.toLocaleLowerCase() === account.toLocaleLowerCase() &&
    (auction.ended === false && isExpired(auction))) {
    return EnumBidStatus.Winner;
  }

  if (auction.highestBid.account.toLocaleLowerCase() === account.toLocaleLowerCase() &&
    auction.ended === false && !isExpired(auction)) {
    return EnumBidStatus.Winning;
  }

  if (auction.returns && auction.returns[account] > 0 && (auction.ended === true || isExpired(auction))) {
    return EnumBidStatus.EndedWithdraw;
  }

  return EnumBidStatus.OutBidded;
}
