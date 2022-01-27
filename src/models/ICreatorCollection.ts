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
  options: string[];
}