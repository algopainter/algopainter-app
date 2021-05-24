import { IArt } from './IArt';

export interface IAuctionItem {
  id: string;
  art: IArt,
  numberOfBids: number;
  highestBid: number;
}
