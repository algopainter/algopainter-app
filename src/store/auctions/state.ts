import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    auctions: [],
    bids: [],
    bidsUpdated: [],
    pirsUpdated: [],
    bidBack: [],
    owner: [],
    auctionId: undefined,
    openAuctionModal: false,
    pirsAuction: [],
    auctionInfoBidBack: undefined,
    openBidBackModal: false,
    openBidBackSimulatorModal: false,
    auctionInfoPirs: undefined,
    openPirsSimulatorModal: false,
    openPirsModal: false,
    updateBidBackStakedAlgop: undefined,
    updatePirsStakedAlgop: undefined,
  };
}

export default state;
