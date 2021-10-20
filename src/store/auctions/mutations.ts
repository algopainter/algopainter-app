import { MutationTree } from 'vuex';
import { AuctionStateInterface } from './types';

const mutation: MutationTree<AuctionStateInterface> = {
  SET_HOT_BIDS(state: AuctionStateInterface, payload) {
    state.hotBids = payload as [];
  },
  SET_TOP_SELLERS(state: AuctionStateInterface, payload) {
    state.topSellers = payload as [];
  },
  SET_TOP_BUYERS(state: AuctionStateInterface, payload) {
    state.topBuyers = payload as [];
  },
  SET_AUCTIONS(state: AuctionStateInterface, payload) {
    state.auctions = payload as [];
  },
  SET_AUCTION_ID(state: AuctionStateInterface, payload) {
    state.auctionId = payload as string | undefined;
  },
  SET_OPEN_AUCTION_MODAL(state: AuctionStateInterface) {
    state.openAuctionModal = !state.openAuctionModal;
  },
  SET_OPEN_BID_BACK_MODAL(state: AuctionStateInterface) {
    state.openBidBackModal = !state.openBidBackModal;
  },
  SET_BID_BACK_ID(state: AuctionStateInterface, payload) {
    state.bidBackId = payload as string;
  },
  SET_BID_BACK_INDEX(state: AuctionStateInterface, payload) {
    state.bidbackIndex = payload as number;
  },
  SET_BIDS(state: AuctionStateInterface, payload) {
    state.bids = payload as [];
  },
  SET_BIDBACK(state: AuctionStateInterface, payload) {
    state.bids = payload as [];
  },
  SET_PIRS_AUCTION(state: AuctionStateInterface, payload) {
    state.pirsAuction = payload as [];
  },
  SET_IMAGE_PAST_OWNERS(state: AuctionStateInterface, payload) {
    state.owner = payload as [];
  },
  SET_PIRS_ID(state: AuctionStateInterface, payload) {
    state.pirsId = payload as number;
  },
  SET_PIRS_INDEX(state: AuctionStateInterface, payload) {
    state.pirsIndex = payload as number;
  },
  SET_OPEN_PIRS_MODAL(state: AuctionStateInterface) {
    state.openPirsModal = !state.openPirsModal;
  },
};

export default mutation;
