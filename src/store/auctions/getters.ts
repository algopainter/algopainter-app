import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';

const getters: GetterTree<AuctionStateInterface, StateInterface> = {
  getAllBids(state: AuctionStateInterface): [] | undefined {
    return state.allBids;
  },
  getOnSale(state: AuctionStateInterface): [] | undefined {
    return state.onSale;
  },
  openAuctionModal(state: AuctionStateInterface): boolean {
    return state.openAuctionModal;
  },
};

export default getters;
