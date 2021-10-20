export interface AuctionStateInterface {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    auctions: [],
    bids: [],
    bidBack: [],
    owner: [],
    auctionId: string | undefined,
    openAuctionModal: boolean;
    openBidBackModal: boolean;
    bidBackId: string | undefined,
    bidbackIndex: number | undefined,
    pirsId: number | undefined,
    pirsIndex: number | undefined,
    pirsAuction: [],
    openPirsModal: boolean,
}
