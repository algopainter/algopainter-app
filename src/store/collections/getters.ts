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
};

export default getters;
