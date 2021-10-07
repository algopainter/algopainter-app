import { CollectionsStateInterface } from './types';

function state(): CollectionsStateInterface {
  return {
    hotBids: [],
    topSellers: [],
    topBuyers: [],
    userItems: '',
    images: [],
    collections: [],
    userOnSale: [],
    onSalePublic: [],
  };
}

export default state;
