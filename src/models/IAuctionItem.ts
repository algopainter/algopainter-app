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
  ended: boolean;
  expirationDt: string;
  fee: {
    address: string;
    auction: string;
    bidBack: number;
  }
  index: number;
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
    collectionName: string;
    collectionOwner: string;
  }
  likers: string[];
  likes: number;
  minimumBid: {
    amount: number;
    tokenPriceAddress: string;
    tokenSymbol: string;
  }
  owner: string;
  startDt: string;
  updatedAt: string;
  users: [{
    account: string;
    avatar: string;
    customProfile: string;
    name: string;
    role: string;
  }];
  _v: number;
}
