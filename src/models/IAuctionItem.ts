import { IBid } from './IBid';

export interface IAuctionItem {
  _id: string;
  index: number;
  bids: {
    amount: number;
    bidder: {
      _id: string;
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
    }
    createdAt: string;
    tokenSymbol: string;
    length: number;
  }
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
  highestBid: IBid;
  isHot: boolean;
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
