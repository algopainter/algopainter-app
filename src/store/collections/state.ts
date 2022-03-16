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
    userOnSalePublic: [],
    userPastImages: [],
    imagePastOwners: [],
    reportAuction: [],
    reportMints: [],
    userPirsTabImages: [],
    isNewPaintingModalOpen: false,
  };
}

export default state;
