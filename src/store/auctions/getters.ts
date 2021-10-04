import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';

const getters: GetterTree<AuctionStateInterface, StateInterface> = {
  getAuctions(state: AuctionStateInterface): [] | undefined {
    return state.auctions;
  },
  openAuctionModal(state: AuctionStateInterface): boolean {
    return state.openAuctionModal;
  },
  openBidBackModal(state: AuctionStateInterface): boolean {
    return state.openBidBackModal;
  },
  getBids(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
  getBidBack(state: AuctionStateInterface): [] |undefined {
    return state.bids;
  },
  getBidBackId(state: AuctionStateInterface): string |undefined {
    return state.bidBackId;
  },
};

export default getters;
