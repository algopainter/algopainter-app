import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { CollectionsStateInterface } from './types';

const getters: GetterTree<CollectionsStateInterface, StateInterface> = {
  GET_USER_ITEMS(state: CollectionsStateInterface): string {
    return state.userItems;
  },
  GET_IMAGES(state: CollectionsStateInterface): [] {
    return state.images;
  },
  GET_COLLECTIONS(state: CollectionsStateInterface): [] {
    return state.collections;
  },
  GET_USER_ON_SALE(state: CollectionsStateInterface): [] {
    return state.userOnSale;
  },
  GET_USER_PAST_IMAGES(state: CollectionsStateInterface): [] {
    return state.userPastImages as [];
  },
  pirsTabImages(state: CollectionsStateInterface): [] {
    return state.userPirsTabImages as [];
  },
  GET_IMAGE_PAST_OWNERS(state: CollectionsStateInterface): [] {
    return state.imagePastOwners as [];
  },
};

export default getters;
