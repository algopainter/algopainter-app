import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { AuctionStateInterface } from './types';
import { IAuctionItem } from 'src/models/IAuctionItem';

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
  openBidBackSimulatorModal(state: AuctionStateInterface): boolean {
    return state.openBidBackSimulatorModal;
  },
  getBids(state: AuctionStateInterface): [] | undefined {
    return state.bids;
  },
  getBidBack(state: AuctionStateInterface): [] | undefined {
    return state.bids;
  },
  getPirsAuction(state: AuctionStateInterface): [] | undefined {
    return state.pirsAuction;
  },
  getImagePastOwners(state: AuctionStateInterface): [] | undefined {
    return state.owner;
  },
  openPirsModal(state: AuctionStateInterface): boolean {
    return state.openPirsModal;
  },
  getPirsCollectionOwner(state: AuctionStateInterface): string | undefined {
    return state.pirsCollectionOwner;
  },
  getPirsItemIndex(state: AuctionStateInterface): number | undefined {
    return state.pirsItemIndex;
  },
  getAuctionInfo(state: AuctionStateInterface): IAuctionItem | undefined {
    return state.auctionInfo;
  },
};

export default getters;
