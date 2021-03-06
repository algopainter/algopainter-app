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
  SET_GWEI_IS_PREVIEWING(state: MintStateInterface, payload) {
    state.gwei.isPreviewing = payload;
  },
  SET_EXPRESSIONS_IS_PREVIEWING(state: MintStateInterface, payload) {
    state.expressions.isPreviewing = payload;
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
  SET_GWEI_IPFS_URL(state: MintStateInterface, payload) {
    state.gwei.IPFSUrl = payload;
  },
  SET_EXPRESSIONS_IPFS_URL(state: MintStateInterface, payload) {
    state.expressions.IPFSUrl = payload;
  },
  SET_GWEI_USER_CONFIRMATIONS(state: MintStateInterface, payload) {
    state.gwei.userConfirmations = payload;
  },
  SET_EXPRESSIONS_USER_CONFIRMATIONS(state: MintStateInterface, payload) {
    state.expressions.userConfirmations = payload;
  },
  SET_GWEI_IS_MINTING(state: MintStateInterface, payload) {
    state.gwei.isMinting = payload;
  },
  SET_EXPRESSIONS_IS_MINTING(state: MintStateInterface, payload) {
    state.expressions.isMinting = payload;
  },
  SET_GWEI_ERROR_MESSAGE(state: MintStateInterface, payload) {
    state.gwei.errorMessage = payload;
  },
  SET_EXPRESSIONS_ERROR_MESSAGE(state: MintStateInterface, payload) {
    state.expressions.errorMessage = payload;
  },
  SET_COLLECTION_NAME(state: MintStateInterface, payload) {
    state.formGenerator.collectionName = payload;
  },
  SET_COLLECTIONS(state: MintStateInterface, payload) {
    state.formGenerator.collections = payload;
  },
  SET_COLLECTIONS_VERIFY(state: MintStateInterface, payload) {
    state.formGenerator.collections = payload;
  },
  SET_VERIFY_PREVIEW(state: MintStateInterface, payload) {
    state.formGenerator.collections = payload;
  },
  SET_IS_COLLECTION_EXISTENT(state: MintStateInterface, payload) {
    state.formGenerator.isCollectionExistent = payload;
  },
  SET_COLLECTION_DATA(state: MintStateInterface, payload) {
    state.formGenerator.collectionData = payload;
  },
  SET_PREVIEW_URL(state: MintStateInterface, payload) {
    state.formGenerator.previewUrl = payload;
  },
  SET_BASIC_INFO(state: MintStateInterface, payload) {
    state.formGenerator.artBasicInfo = payload;
  },
  SET_IPFS_URL(state: MintStateInterface, payload) {
    state.formGenerator.IPFSUrl = payload;
  },
  SET_IS_MINTING(state: MintStateInterface, payload) {
    state.formGenerator.isMinting = payload;
  },
  SET_USER_CONFIRMATIONS(state: MintStateInterface, payload) {
    state.formGenerator.userConfirmations = payload;
  },
  SET_ERROR_MESSAGE(state: MintStateInterface, payload) {
    state.formGenerator.errorMessage = payload;
  },
  SET_COLLECTION_INFO(state: MintStateInterface, payload) {
    state.formGenerator.collectionInfo = payload;
  },
  SET_IS_PINNING_PREVIEW_URL(state: MintStateInterface, payload) {
    state.formGenerator.isPinningPreviewUrl = payload;
  },
  SET_UPDATE_TOP_INFO(state: MintStateInterface) {
    state.updateTopInfo = !state.updateTopInfo;
  }
};

export default mutation;
