import { IAuctionItem } from 'src/models/IAuctionItem';
export interface AuctionStateInterface {
  hotBids: [],
  topSellers: [],
  topBuyers: [],
  auctions: [],
  bids: [],
  bidBack: [],
  owner: [],
  auctionId: string | undefined,
  openAuctionModal: boolean,
  openBidBackModal: boolean,
  pirsAuction: [],
  openPirsModal: boolean,
  openBidBackSimulatorModal: boolean,
  openPirsSimulatorModal: boolean,
  auctionInfoBidBack: IAuctionItem | undefined,
  auctionInfoPirs: IAuctionItem | undefined,
}
