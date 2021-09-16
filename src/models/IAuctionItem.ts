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
    _id: string;
    likes: number;
    likers: string[];
    image: string;
    previewImage: string;
    previewImageUrl: string;
    tags: string[];
    title: string;
    collectionName: string;
    collectionOwner: string;
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
    createdAt: string;
    tokenSymbol: string;
    tokenPriceAddress: string;
  }
  startDt: string;
  updatedAt: string;
  users: [{
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
    type: string;
    updatedAt: string;
    _id: string;
  }];
  _v: number;
}
