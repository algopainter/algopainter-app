import { IFormParams, IFormCollectionInfo, IFormFixedParams } from './ICreatorCollection';
export interface ICollection {
  _id: string;
  description: string;
  owner: string;
  title: string;
  avatar: string;
  account: string;
  customURL: string;
  show: boolean;
  namelc: string;
  params: IFormParams[];
  collectionInfo: IFormCollectionInfo;
  fixedParams: IFormFixedParams[];
  index: number;
}
