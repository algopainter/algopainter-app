export interface IBid {
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
