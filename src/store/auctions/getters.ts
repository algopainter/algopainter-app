import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';

const getters: GetterTree<AuctionStateInterface, StateInterface> = {
  getAllBids(state: AuctionStateInterface): [] | undefined {
    return state.allBids;
  },
  openAuctionModal(state: AuctionStateInterface): boolean {
    return state.openAuctionModal;
  },
  getBids(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
  getBidBack(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
};

export default getters;
