export interface IAuctionItem2 {
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
    type: string;
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
  isHot: boolean;
  item: {
    likes: number;
    previewImageUrl: string;
    tags: string[];
    title: string;
    _id: string;
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
  _id: string;
}
