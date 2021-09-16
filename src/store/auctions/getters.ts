import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';

const getters: GetterTree<AuctionStateInterface, StateInterface> = {
  getAllBids(state: AuctionStateInterface): [] | undefined {
    return state.allBids;
  },
  getAuctionId(state: AuctionStateInterface): string | undefined {
    return state.auctionId;
  },
  openAuctionModal(state: AuctionStateInterface): boolean {
    return state.openAuctionModal;
  },
  getBids(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
};

export default getters;
