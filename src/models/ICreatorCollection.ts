export interface ICreatorCollection {
  title: string;
  name: string;
  description: string;
  owner: string; //smart contract
  creator: string; //user account
  avatar: string | null | undefined;
  account: string;
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
    value: string | number;
  }[]
  ;
  min: string | number;
  max: string | number;
  defaultValue: string | number | boolean;
}

export interface IGeneratedParams {
  [param: string]: string | number;
}

export interface ICollectionNFTCreationAPI {
  url: string;
  parameters: any //JsonSchema
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
  priceType: 'fixed' | 'variable';
  tokenPriceAddress: string | null | undefined;
  tokenPriceSymbol: string | null | undefined;
  priceRange: ICollectionMetricsPriceRange[];
  creatorPercentage: number;
  walletAddress: string;
}