import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    auctions: [],
    bids: [],
    bidBack: [],
    owner: [],
    auctionId: undefined,
    openAuctionModal: false,
    openBidBackModal: false,
    pirsAuction: [],
    openPirsModal: false,
    openBidBackSimulatorModal: false,
    openPirsSimulatorModal: false,
    auctionInfo: undefined,
  };
}

export default state;
