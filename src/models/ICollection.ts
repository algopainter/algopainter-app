import { IImage } from './IImage';
import { IOwner } from './IOwner';

export interface ICollection {
  _id: string;
  title: string;
  description: string;
  images: IImage[];
  owner: IOwner;
}
