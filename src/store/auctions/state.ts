import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    allBids: [],
    auctionId: undefined,
    openAuctionModal: false,
  };
}

export default state;
