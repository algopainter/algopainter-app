import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    allBids: [],
    bids: [],
    bidBack: [],
    auctionId: undefined,
    openAuctionModal: false,
  };
}

export default state;
