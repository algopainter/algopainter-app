import { IFormParams, IFormCollectionInfo, IFormFixedParams, ICollectionMetrics, ICollectionNFTCreationAPI } from './ICreatorCollection';
export default interface ICollection {
  _id: string;
  blockchainId: string;
  description: string;
  owner: string;
  title: string;
  avatar: string;
  account: string;
  customURL: string;
  show: boolean;
  namelc: string;
  metrics: ICollectionMetrics;
  api: ICollectionNFTCreationAPI;
  params: IFormParams[];
  collectionInfo: IFormCollectionInfo;
  fixedParams: IFormFixedParams[];
  index: number;
}
