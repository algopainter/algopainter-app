import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    allBids: [],
    openAuctionModal: false,
  };
}

export default state;
