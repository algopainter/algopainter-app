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

export interface IArtistCollectionTokenURI {
  collectionId: string;
  name: string;
  description: string;
  creatorRoyalty: number;
  params: string[];
  image: string; //IPFS Hash 2000x2000
  previewImage: string; //IPFS Hash 400x400
  mintedBy: string; //Account
}