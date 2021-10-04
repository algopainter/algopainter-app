import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    auctions: [],
    bids: [],
    auctionId: undefined,
    openAuctionModal: false,
    openBidBackModal: false,
  };
}

export default state;
