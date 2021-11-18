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
  pirsCollectionOwner: string | undefined,
  pirsItemIndex: number | undefined,
  pirsAuction: [],
  openPirsModal: boolean,
  openBidBackSimulatorModal: boolean,
  auctionInfo: IAuctionItem | undefined,
}
