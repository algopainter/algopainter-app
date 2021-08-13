import Moment from 'moment';

import { IArt } from './IArt';
import { IUser } from './IUser';

export interface IBid {
  id: string;
  art: IArt,
  user?: IUser,
  price: number;
  bidAt: Moment.Moment;
}
