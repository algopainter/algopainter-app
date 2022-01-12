export interface IMintTokenURIData {
  name: string;
  description: string;
  fileName: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  previewImage: string;
  rawImage: string;
  rawImageHash: string;
}

export interface IMintData {
  tokenURI: string;
  data: IMintTokenURIData;
}

export interface ICollectionInfo {
  collectionName: string;
  batchPriceBlockchain: string;
  batchPriceCurrency: string;
  collectionToken: string;
  remaining: number;
  minted: string;
  tokensToBurn: number | undefined;
}

export interface IArtBasicInfo {
  name: string;
  description: string;
}

export enum MintStatus{
  GeneratingPreviewFile,
  GeneratingPreviewFileError,
  GeneratingRawFile,
  GeneratingRawFileError,
  GeneratingDescriptorFile,
  GeneratingDescriptorFileError,
  CollectingUserConfirmations,
  MintAwaitingInput,
  MintAwaitingConfirmation,
  MintError,
  ItemMinted,
}