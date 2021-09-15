import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import { api } from 'src/boot/axios';

const actions: ActionTree<AuctionStateInterface, StateInterface> = {
  async getHotBids() {
    try {
      const res = await api.get('auctions');
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
  async getBids() {
  // async getBids(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // const account = value.account as string;
    const account = '0x3249341a70324baf2c92367889335fc560c012ff';
    try {
      const result = await api.get(`users/${account}/auctions/biding`);
      const bids = result.data as [];
      this.commit('auctions/SET_BIDS', bids);
    } catch (e) {
      console.log('error getAuction msg');
    } finally {
      console.log('success msg');
    }
  },
};

export default actions;
