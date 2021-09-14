import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';

const getters: GetterTree<AuctionStateInterface, StateInterface> = {
  getAllBids(state: AuctionStateInterface): [] |undefined {
    return state.allBids;
  },
  getBids(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
};

export default getters;
