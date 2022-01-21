import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import MintStateInterface from './types';
import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';

const getters: GetterTree<MintStateInterface, StateInterface> = {
  GET_GWEI_COLLECTION_INFO(state: MintStateInterface): ICollectionInfo | undefined {
    return state.gwei.collectionInfo;
  },
  GET_EXPRESSIONS_COLLECTION_INFO(state: MintStateInterface): ICollectionInfo | undefined {
    return state.expressions.collectionInfo;
  },
  GET_GWEI_ITEM_PARAMETERS(state: MintStateInterface): IGweiParsedItemParameters | undefined {
    return state.gwei.itemParameters;
  },
  GET_EXPRESSIONS_ITEM_PARAMETERS(state: MintStateInterface): IGweiParsedItemParameters | undefined {
    return state.expressions.itemParameters;
  },
  GET_GWEI_PREVIEW_URL(state: MintStateInterface): string | undefined {
    return state.gwei.previewUrl;
  },
  GET_EXPRESSIONS_PREVIEW_URL(state: MintStateInterface): string | undefined {
    return state.expressions.previewUrl;
  },
  GET_GWEI_BASIC_INFO(state: MintStateInterface): IArtBasicInfo | undefined {
    return state.gwei.artBasicInfo;
  },
  GET_EXPRESSIONS_BASIC_INFO(state: MintStateInterface): IArtBasicInfo | undefined {
    return state.expressions.artBasicInfo;
  },
  GET_GWEI_IPFS_URL(state: MintStateInterface): string | undefined {
    return state.gwei.IPFSUrl;
  },
  GET_EXPRESSIONS_IPFS_URL(state: MintStateInterface): string | undefined {
    return state.expressions.IPFSUrl;
  },
  GET_GWEI_USER_CONFIRMATIONS(state: MintStateInterface): boolean | undefined {
    return state.gwei.userConfirmations;
  },
  GET_EXPRESSIONS_USER_CONFIRMATIONS(state: MintStateInterface): boolean | undefined {
    return state.expressions.userConfirmations;
  },
  GET_GWEI_IS_MINTING(state: MintStateInterface): boolean | undefined {
    return state.gwei.isMinting;
  },
  GET_EXPRESSIONS_IS_MINTING(state: MintStateInterface): boolean | undefined {
    return state.expressions.isMinting;
  },
  GET_GWEI_ERROR_MESSAGE(state: MintStateInterface): string | undefined {
    return state.gwei.errorMessage;
  },
  GET_EXPRESSIONS_ERROR_MESSAGE(state: MintStateInterface): string | undefined {
    return state.expressions.errorMessage;
  },
};

export default getters;
