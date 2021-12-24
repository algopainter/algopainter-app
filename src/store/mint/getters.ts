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
};

export default getters;
