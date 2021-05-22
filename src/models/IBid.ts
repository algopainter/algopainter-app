import Moment from 'moment';

import { IArt } from './IArt';

export interface IBid {
  id: string;
  art: IArt,
  price: number;
  bidAt: Moment.Moment;
}
