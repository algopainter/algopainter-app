import { AuctionStateInterface } from './types';

function state(): AuctionStateInterface {
  return {
    hotBids: [],
    hotBidsLoading: true,
    topSellers: [],
    topSellersLoading: true,
    topBuyers: [],
    topBuyersLoading: true,
  };
}

export default state;
