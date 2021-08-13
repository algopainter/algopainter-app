import Moment from 'moment';

export interface IBidder {
  _id: string;
  amount: number;
  bidder: string;
  createdAt: Moment.Moment;
  bidBack: number;
  item: {
    _id: string;
    title: string;
    previewImageUrl: string;
  }
  tokenSymbol: string;
}
