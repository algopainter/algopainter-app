import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    allBids: [],
    onSale: [],
    openAuctionModal: false,
  };
}

export default state;
