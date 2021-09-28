import { IBid } from './IBid';

export interface IAuctionItem {
  _id: string;
  index: number;
  bids: IBid[];
  categories: string[];
  createdAt: string;
  expirationDt: string;
  fee: {
    bidBack: number;
    royalties: {
      type: string;
      value: number;
    }
    service: number;
  }
  withdraws: {
    account: string;
    amount: number;
    auctionId: number;
    avatar: string;
    bidder: string;
    bio: string;
    createdAt: string;
    customProfile: string;
    email: string;
    facebook: string;
    gmail: string;
    instagram: string;
    name: string;
    role: string;
    telegram: string;
    tokenSymbol: string;
    twitter: string;
    type: string;
    updatedAt: string;
    webSite: string;
  }[]
  highestBid: IBid;
  isHot: boolean;
  ended: boolean;
  item: {
    collectionName: string;
    collectionOwner: string;
    description: string;
    image: string;
    index: number;
    previewImage: string;
    rawImage: string;
    title: string;
    _id: string;
  }
  lowestBid: {
    amount: number;
    bidder: {
      account: string;
      avatar: string;
      bio: string;
      createdAt: string;
      name: string;
      networks: {
        name: string,
        type: string,
        url: string,
      }
      role: string;
      type: string,
      updatedAt: string;
      _id: string;
    }
    createdAt: string;
    tokenSymbol: string;
  }
  likers: string[];
  likes: number;
  minimumBid: {
    amount: number;
    createdAt: string;
    tokenSymbol: string;
    tokenPriceAddress: string;
  }
  returns: {
    account: string;
    createdAt: string;
  }[]
  owner: string;
  startDt: string;
  updatedAt: string;
  users: [{
    account: string;
    avatar: string;
    bio: string;
    createdAt: string;
    name: string;
    customProfile: string;
    networks: {
      name: string,
      type: string,
      url: string,
    }
    role: string;
    type: string;
    updatedAt: string;
    _id: string;
  }];

  _v: number;
}
