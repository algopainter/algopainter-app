import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import { api } from 'src/boot/axios';

const actions: ActionTree<AuctionStateInterface, StateInterface> = {
  async getHotBids() {
    try {
      const res = await api.get('auctions?page=1&isHot=true');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const hotBids = res.data as [];
      this.commit('auctions/SET_HOT_BIDS', hotBids);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
  async getTopSellers() {
    try {
      const res = await api.get('reports/top/sellers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const topSellers = res.data as [];
      this.commit('auctions/SET_TOP_SELLERS', topSellers);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
  async getTopBuyers() {
    try {
      const res = await api.get('reports/top/buyers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const TopBuyers = res.data as [];
      this.commit('auctions/SET_TOP_BUYERS', TopBuyers);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
  async getAllBids() {
    try {
      const res = await api.get('auctions');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const allBids = res.data as [];
      this.commit('auctions/SET_ALL_BIDS', allBids);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
  async getOnSale(type, value: {account: string, collectionName: string, page: number, perPage: string, type: string}) {
    console.log('value', value);
    const account = value.account;
    const page = value.page;
    const perPage = value.perPage;
    const collectionName = value.collectionName;
    const currentCollection = (collectionName === undefined || collectionName.toLowerCase() === 'all collections') ? '' : collectionName;
    try {
      const res = await api.get(`auctions?page=${page}&perPage=${perPage}&item.collectionName=${currentCollection}&owner=${account}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('res', res);
      const onSale = res.data as [];
      console.log('onSale', onSale);
      this.commit('auctions/SET_ON_SALE', onSale);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
  openAuctionModal() {
    this.commit('auctions/SET_OPEN_AUCTION_MODAL');
  },
};

export default actions;
