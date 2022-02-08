import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import MintStateInterface from './types';
import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { api } from 'src/boot/axios';

const actions: ActionTree<MintStateInterface, StateInterface> = {
  collectionInfo(type, value) {
    const collectionInfo: ICollectionInfo = value.collectionInfo;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_COLLECTION_INFO', collectionInfo);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_COLLECTION_INFO', collectionInfo);
    }
  },

  previewUrl(type, value) {
    const previewUrl: string = value.previewUrl;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_PREVIEW_URL', previewUrl);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_PREVIEW_URL', previewUrl);
    }
  },

  itemParameters(type, value) {
    const parsedItem: ICollectionInfo = value.parsedItem;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_ITEM_PARAMETERS', parsedItem);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_ITEM_PARAMETERS', parsedItem);
    }
  },

  artBasicInfo(type, value) {
    const artBasicInfo: IArtBasicInfo = value.artBasicInfo;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_BASIC_INFO', artBasicInfo);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_BASIC_INFO', artBasicInfo);
    }
  },

  IPFSUrl(type, value) {
    const IPFSUrl: string = value.IPFSUrl;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_IPFS_URL', IPFSUrl);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_IPFS_URL', IPFSUrl);
    }
  },

  userConfirmations(type, value) {
    const userConfirmations: boolean = value.userConfirmations;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_USER_CONFIRMATIONS', userConfirmations);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_USER_CONFIRMATIONS', userConfirmations);
    }
  },

  mintingStatus(type, value) {
    const isMinting: boolean = value.isMinting;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_IS_MINTING', isMinting);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_IS_MINTING', isMinting);
    }
  },

  errorMessage(type, value) {
    const errorMessage: string = value.errorMessage;
    const collectionName: string = value.collectionName;

    if (collectionName === 'gwei') {
      this.commit('mint/SET_GWEI_ERROR_MESSAGE', errorMessage);
    } else if (collectionName === 'expressions') {
      this.commit('mint/SET_EXPRESSIONS_ERROR_MESSAGE', errorMessage);
    }
  },

  async isCollectionExistent(type, value) {
    const collection = value.collection as string;

    try {
      await api.get(`users/${collection}/account`);

      this.commit('mint/SET_IS_COLLECTION_EXISTENT', true);
    } catch (e) {
      this.commit('mint/SET_IS_COLLECTION_EXISTENT', false);
    }
  },

  async collectionParams(type, value) {
    const collectionCustomUrl: string = value.collectionCustomUrl;

    try {
      const res = await api.get(`collections?customURL=${collectionCustomUrl}`);

      this.commit('mint/SET_COLLECTION_PARAMS', res); //res.params
    } catch (e) {
      console.log('Error message: mint/actions - collectionParams');
    }
  },
};

export default actions;
