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
    bidBackId: undefined,
    bidbackIndex: undefined,
    pirsCollectionOwner: undefined,
    pirsItemIndex: undefined,
    pirsAuction: [],
    openPirsModal: false,
  };
}

export default state;
