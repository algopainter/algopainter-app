export interface ICreatorCollection {
  title: string;
  name: string;
  description: string;
  owner: string; //smart contract
  creator: string; //user account
  avatar: string | null | undefined;
  account: string;
  namelc: string;
  bio?: string;
  type?: string;
  instagram?: string | null;
  twitter?: string | null;
  _v?: number;
  facebook?: string | null;
  gmail?: string | null;
  telegram?: string | null;
  webSite? : string | null;
  customProfile?: string | undefined;
}

export interface IFormParams {
  name: string;
  label: string;
  dataType: string;
  maxLength: number;
  fieldType: string;
  options: {
    label: string;
    value: string | number | (string | number)[];
  }[];
  maxValues: number;
  min: string | number;
  max: string | number;
  defaultValue: string | number | boolean | {label: string; value: string | number};
}

export interface IFormFixedParams {
  name: string;
  value: string;
}

export interface IFormCollectionInfo {
  api: string;
  isSpecialParamsChecked: boolean;
  isSizeInUrlChecked: boolean;
  width: string | number;
  height: string | number;
}

export interface IGeneratedParams {
  [param: string]: string | number;
}

export interface ICollectionNFTCreationAPI {
  collectionInfo: IFormCollectionInfo;
  fixedParams: IFormFixedParams[];
  parameters: IFormParams[];
}

export interface IAboutTheCollection {
  account: string,
  artistName: string,
  avatar: string,
  creator: string,
  customProfile: string,
  description: string,
  facebook: string,
  fileName: string,
  gmail: string,
  instagram: string,
  nameCollection: string,
  telegram: string,
  twitter: string,
  webSite: string
}

export interface ICollectionMetricsPriceRange {
  from: number;
  to: number;
  amount: number | string;
  tokenPriceAddress: string;
  tokenPriceSymbol: string;
}

export interface ICollectionMetrics {
  nfts: number;
  startDT: Date | string;
  endDT: Date | string;
  priceType: string;
  tokenPriceAddress: string | null | undefined;
  tokenPriceSymbol: string | null | undefined;
  priceRange: ICollectionMetricsPriceRange[];
  creatorPercentage: number;
  walletAddress: string;
}

export interface IcollectionData {
  aboutTheCollection: IAboutTheCollection,
  collectionMetrics: ICollectionMetrics,
  apiParameters: ICollectionNFTCreationAPI
}

export interface IAllowedTokens {
  [key: string]: boolean;
}