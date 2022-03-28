import { IArt } from './IArt';

export interface IGallery {
  id: string;
  description: string;
  index: number;
  sequentialNumber?: number;
  art: IArt,
}
