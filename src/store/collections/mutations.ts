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
  SET_ON_SALE_PUBLIC(state: CollectionsStateInterface, payload) {
    state.onSalePublic = payload as [];
  },
};

export default mutation;
