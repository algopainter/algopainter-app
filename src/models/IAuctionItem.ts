import { IBid } from './IBid';

export interface IAuctionItem {
  bids: {
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
    likes: number;
    likers: string[];
    previewImage: string;
    tags: string[];
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
  minimumBid: {
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
  startDt: string;
  updatedAt: string;
  users: [{
    account: string;
    createdAt: string;
    type: string;
    role: string;
    name: string;
    updatedAt: string;
    avatar: string;
    bio: string;
    networks: {
      name: string,
      type: string,
      url: string,
    }
    customProfile: string,
    _id: string;
  }];
  _v: number;
  _id: string;
}
