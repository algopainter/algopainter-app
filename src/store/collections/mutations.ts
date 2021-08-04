import { MutationTree } from 'vuex';
import { CollectionsStateInterface } from './types';

const mutation: MutationTree<CollectionsStateInterface> = {
  SET_USER_ITEMS(state: CollectionsStateInterface, payload) {
    state.userItems = payload as string;
  },
};

export default mutation;
