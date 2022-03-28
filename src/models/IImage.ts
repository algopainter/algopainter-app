import { IImageUser } from './IImageUser';
import { IProfile } from './IProfile';

export interface INFTArtist extends IImageUser {
  _id: string;

}

export interface IImageNFTInfo {
  _id: string;
  image: string;
  index: number;
  sequentialNumber?: number;
  previewImage: string;
  rawImage: string;
  parameters: Record<string, unknown>;
}

export interface IImage {
  _id: string;
  title: string;
  likes: number;
  description: string;
  collectionName: string;
  collectionOwner: string;
  tags: string[];
  nft: IImageNFTInfo;
  pirs: {
    creatorRate:number;
    investorRate: number | null;
  };
  owner: string;
  creator: string;
  users: IProfile[];
  likers?: string[] | null;
}
