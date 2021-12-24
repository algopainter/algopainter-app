import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import MintStateInterface from './types';
import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';

const actions: ActionTree<MintStateInterface, StateInterface> = {
  collectionInfo(type, value) {
    const collectionInfo: ICollectionInfo = value.collectionInfo;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit("mint/SET_GWEI_COLLECTION_INFO", collectionInfo);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_COLLECTION_INFO', collectionInfo);
    }
  },

  previewUrl(type, value) {
    const previewUrl: string = value.previewUrl;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit("mint/SET_GWEI_PREVIEW_URL", previewUrl);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_PREVIEW_URL', previewUrl);
    }
  },

  itemParameters(type, value) {
    const parsedItem: ICollectionInfo = value.parsedItem;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit("mint/SET_GWEI_ITEM_PARAMETERS", parsedItem);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_ITEM_PARAMETERS', parsedItem);
    }
  },

  artBasicInfo(type, value) {
    const artBasicInfo: IArtBasicInfo = value.artBasicInfo;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit("mint/SET_GWEI_BASIC_INFO", artBasicInfo);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_BASIC_INFO', artBasicInfo);
    }
  },
};

export default actions;
