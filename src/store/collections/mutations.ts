import { MutationTree } from 'vuex';
import { CollectionsStateInterface } from './types';

const mutation: MutationTree<CollectionsStateInterface> = {
  SET_USER_ITEMS(state: CollectionsStateInterface, payload) {
    state.userItems = payload as string;
  },
  SET_IMAGES(state: CollectionsStateInterface, payload) {
    state.images = payload as [];
  },
};

export default mutation;
