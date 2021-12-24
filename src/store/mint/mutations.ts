import { MutationTree } from 'vuex';
import MintStateInterface from './types';

const mutation: MutationTree<MintStateInterface> = {
  SET_GWEI_COLLECTION_INFO(state: MintStateInterface, payload) {
    state.gwei.collectionInfo = payload;
  },
  SET_EXPRESSIONS_COLLECTION_INFO(state: MintStateInterface, payload) {
    state.expressions.collectionInfo = payload;
  },
  SET_GWEI_ITEM_PARAMETERS(state: MintStateInterface, payload) {
    state.gwei.itemParameters = payload;
  },
  SET_EXPRESSIONS_ITEM_PARAMETERS(state: MintStateInterface, payload) {
    state.expressions.itemParameters = payload;
  },
  SET_GWEI_PREVIEW_URL(state: MintStateInterface, payload) {
    state.gwei.previewUrl = payload;
  },
  SET_EXPRESSIONS_PREVIEW_URL(state: MintStateInterface, payload) {
    state.expressions.previewUrl = payload;
  },
  SET_GWEI_BASIC_INFO(state: MintStateInterface, payload) {
    state.gwei.artBasicInfo = payload;
  },
  SET_EXPRESSIONS_BASIC_INFO(state: MintStateInterface, payload) {
    state.expressions.artBasicInfo = payload;
  },
};

export default mutation;
