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
  openPirsSimulatorModal(state: AuctionStateInterface): boolean {
    return state.openPirsSimulatorModal;
  },
  getBids(state: AuctionStateInterface): [] | undefined {
    return state.bids;
  },
  getBidBackUpdated(state: AuctionStateInterface): [] | undefined {
    return state.bids;
  },
  getBidsUpdated(state: AuctionStateInterface): [] | undefined {
    return state.bidsUpdated;
  },
  getPirsUpdated(state: AuctionStateInterface): [] | undefined {
    return state.pirsUpdated;
  },
  getBidBack(state: AuctionStateInterface): [] | undefined {
    return state.bidbacks;
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
  getAuctionInfoBidBack(state: AuctionStateInterface): IAuctionItem | undefined {
    return state.auctionInfoBidBack as IAuctionItem;
  },
  getAuctionInfoPirs(state: AuctionStateInterface): IAuctionItem | undefined {
    return state.auctionInfoPirs as IAuctionItem;
  },
  updateBidBackStakedAlgop(state: AuctionStateInterface): {collectionOwner: string, itemIndex: number} | undefined {
    return state.updateBidBackStakedAlgop;
  },
  updatePirsStakedAlgop(state: AuctionStateInterface): {collectionOwner: string, itemIndex: number} | undefined {
    return state.updatePirsStakedAlgop;
  },
};

export default getters;
