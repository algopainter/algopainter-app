import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    allBids: [],
    bids: [],
    auctionId: undefined,
    openAuctionModal: false,
  };
}

export default state;
