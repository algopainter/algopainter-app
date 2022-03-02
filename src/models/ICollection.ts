import { ICollectionMetrics, ICollectionNFTCreationAPI } from './ICreatorCollection';
export default interface ICollection {
  _id: string;
  blockchainId: number;
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
}
