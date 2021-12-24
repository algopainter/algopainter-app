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
      isMinting: false,
    },
    expressions: {
      collectionInfo: undefined,
      itemParameters: undefined,
      previewUrl: undefined,
      isPreviewing: false,
      isMinting: false,
      artBasicInfo: undefined,
      hasPreviewed: false,
    },
  };
}

export default state;
