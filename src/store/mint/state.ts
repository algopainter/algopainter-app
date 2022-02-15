import MintStateInterface from './types';

function state(): MintStateInterface {
  return {
    gwei: {
      collectionInfo: undefined,
      itemParameters: undefined,
      previewUrl: undefined,
      artBasicInfo: undefined,
      IPFSUrl: undefined,
      userConfirmations: undefined,
      isMinting: false,
      errorMessage: undefined
    },
    expressions: {
      collectionInfo: undefined,
      itemParameters: undefined,
      previewUrl: undefined,
      artBasicInfo: undefined,
      IPFSUrl: undefined,
      userConfirmations: undefined,
      isMinting: false,
      errorMessage: undefined
    },
    formGenerator: {
      collectionParams: undefined,
      collectionName: undefined,
      collections: undefined,
      isCollectionExistent: false,
      collectionData: undefined,
      collectionInfo: undefined,
      previewUrl: undefined,
      artBasicInfo: undefined,
      IPFSUrl: undefined,
      userConfirmations: undefined,
      isMinting: false,
      errorMessage: undefined,
    }
  };
}

export default state;
