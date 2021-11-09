export interface AuctionStateInterface {
  hotBids: [];
  topSellers: [];
  topBuyers: [];
  auctions: [];
  bids: [];
  bidBack: [];
  owner: [];
  auctionId: string | undefined;
  openAuctionModal: boolean;
  openBidBackModal: boolean;
  bidBackId: string | undefined;
  bidBackIndex: number | undefined;
  pirsCollectionOwner: string | undefined;
  pirsItemIndex: number | undefined;
  pirsAuction: [];
  openPirsModal: boolean;
}
