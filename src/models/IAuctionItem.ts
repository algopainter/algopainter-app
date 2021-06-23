import { IArt } from './IArt';
import { IBid } from './IBid';

export interface IAuctionItem {
  id: string;
  art: IArt,
  bids?: IBid[]
  numberOfBids: number;
  highestBid: number;
}
