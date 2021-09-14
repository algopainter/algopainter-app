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
  SET_ALL_BIDS(state: AuctionStateInterface, payload) {
    state.allBids = payload as [];
  },
  SET_BIDS(state: AuctionStateInterface, payload) {
    state.bids = payload as [];
  },
};

export default mutation;
