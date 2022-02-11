import MintStateInterface from './types';

function state(): MintStateInterface {
  return {
    gwei: {
      collectionInfo: undefined,
      itemParameters: undefined,
      previewUrl: undefined,
      isPreviewing: false,
      hasPreviewed: false,
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
      isPreviewing: false,
      hasPreviewed: false,
      artBasicInfo: undefined,
      IPFSUrl: undefined,
      userConfirmations: undefined,
      isMinting: false,
      errorMessage: undefined
    },
    formGenerator: {
      isCollectionExistent: false,
      collectionParams: undefined,
      collectionName: undefined,
      collections: undefined,
    }
  };
}

export default state;
