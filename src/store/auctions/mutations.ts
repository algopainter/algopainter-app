import { MutationTree } from 'vuex';
import { AuctionStateInterface } from './types';
import { IAuctionItem } from 'src/models/IAuctionItem';

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
  SET_BIDS(state: AuctionStateInterface, payload) {
    state.bids = payload as [];
  },
  SET_BIDBACK(state: AuctionStateInterface, payload) {
    state.bids = payload as [];
  },
  SET_BIDS_UPDATED(state: AuctionStateInterface, payload) {
    state.bidsUpdated = payload as [];
  },
  SET_PIRS_AUCTION(state: AuctionStateInterface, payload) {
    state.pirsAuction = payload as [];
  },
  SET_IMAGE_PAST_OWNERS(state: AuctionStateInterface, payload) {
    state.owner = payload as [];
  },
  SET_OPEN_PIRS_MODAL(state: AuctionStateInterface) {
    state.openPirsModal = !state.openPirsModal;
  },
  SET_OPEN_BID_BACK_SIMULATOR_MODAL(state: AuctionStateInterface) {
    state.openBidBackSimulatorModal = !state.openBidBackSimulatorModal;
  },
  SET_OPEN_PIRS_SIMULATOR_MODAL(state: AuctionStateInterface) {
    state.openPirsSimulatorModal = !state.openPirsSimulatorModal;
  },
  SET_AUCTION_INFO_BIDBACK(state: AuctionStateInterface, payload) {
    state.auctionInfoBidBack = payload as IAuctionItem;
  },
  SET_AUCTION_INFO_PIRS(state: AuctionStateInterface, payload) {
    state.auctionInfoPirs = payload as IAuctionItem;
  },
  UPDATE_BIDBACK_STAKED_ALGOP(state: AuctionStateInterface, payload) {
    state.updateBidBackStakedAlgop = payload as {collectionOwner: string, itemIndex: number};
  },
  UPDATE_PIRS_STAKED_ALGOP(state: AuctionStateInterface) {
    state.updatePirsStakedAlgop = !state.updatePirsStakedAlgop;
  },
};

export default mutation;
