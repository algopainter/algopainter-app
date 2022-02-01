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
  dataType: string;
  fieldType: string;
  options: [
    {
      label: string;
      value: string | number;
    }
  ];
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