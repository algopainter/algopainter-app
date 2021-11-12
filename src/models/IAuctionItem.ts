import { IBid } from './IBid';

export interface IAuctionItem {
  address?: string;
  bidbacks: { [key: string]: number };
  pirs: { [key: string]: number };
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

  _v: number;
}
