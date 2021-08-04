import { IUser } from './IUser';

export interface INFTArtist extends IUser {
  _id: string;
}

export interface IImageNFTInfo {
  _id: string;
  image: string;
  previewImage: string;
  rawImage: string;
  artist: INFTArtist;
  parameters: Record<string, unknown>;
}

export interface IImage {
  _id: string;
  title: string;
  likes: number;
  likers: string[];
  description: string;
  tags: string[];
  nft: IImageNFTInfo;
  users: IUser[];
}
