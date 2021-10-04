import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    auctions: [],
    bids: [],
    bidBack: [],
    auctionId: undefined,
    openAuctionModal: false,
    openBidBackModal: false,
    bidBackId: undefined,
  };
}

export default state;
