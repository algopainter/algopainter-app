import { MutationTree } from 'vuex';
import { CollectionsStateInterface } from './types';

const mutation: MutationTree<CollectionsStateInterface> = {
  SET_USER_ITEMS(state: CollectionsStateInterface, payload) {
    state.userItems = payload as string;
  },
  SET_IMAGES(state: CollectionsStateInterface, payload) {
    state.images = payload as [];
  },
  SET_COLLECTIONS(state: CollectionsStateInterface, payload) {
    state.collections = payload as [];
  },
  SET_USER_ON_SALE(state: CollectionsStateInterface, payload) {
    state.userOnSale = payload as [];
  },
  SET_USER_ON_SALE_PUBLIC(state: CollectionsStateInterface, payload) {
    state.userOnSale = payload as [];
  },
  SET_USER_PAST_IMAGES(state: CollectionsStateInterface, payload) {
    state.userPastImages = payload as [];
  },
  SET_USER_PIRS_TAB_IMAGES(state: CollectionsStateInterface, payload) {
    state.userPirsTabImages = payload as [];
  },
  SET_IMAGE_PAST_OWNERS(state: CollectionsStateInterface, payload) {
    state.imagePastOwners = payload as [];
  },
  SET_REPORT_AUCTIONS(state: CollectionsStateInterface, payload) {
    state.reportAuction = payload as [];
  },
  SET_REPORT_MINTS(state: CollectionsStateInterface, payload) {
    state.reportMints = payload as [];
  },
  SET_REPORT_USER(state: CollectionsStateInterface, payload) {
    state.reportUser = payload as [];
  },
  SET_OPEN_NEW_PAINTING_MODAL(state: CollectionsStateInterface) {
    state.isNewPaintingModalOpen = !state.isNewPaintingModalOpen;
  },
};

export default mutation;
