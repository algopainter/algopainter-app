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
