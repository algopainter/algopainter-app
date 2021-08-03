import { MutationTree } from 'vuex';
import { AuctionStateInterface } from './types';

const mutation: MutationTree<AuctionStateInterface> = {
  SET_HOT_BIDS(state: AuctionStateInterface, payload) {
    state.hotBids = payload as [];
  },
  SET_HOT_BIDS_LOADING(state: AuctionStateInterface, payload) {
    state.hotBidsLoading = payload as boolean;
  },
  SET_TOP_SELLERS(state: AuctionStateInterface, payload) {
    state.topSellers = payload as [];
  },
  SET_TOP_SELLERS_LOADING(state: AuctionStateInterface, payload) {
    state.topSellersLoading = payload as boolean;
  },
  SET_TOP_BUYERS(state: AuctionStateInterface, payload) {
    state.topBuyers = payload as [];
  },
  SET_TOP_BUYERS_LOADING(state: AuctionStateInterface, payload) {
    state.topBuyersLoading = payload as boolean;
  },
};

export default mutation;
