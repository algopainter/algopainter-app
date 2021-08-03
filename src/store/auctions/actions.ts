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
      void this.dispatch({
        type: 'auctions/getHotBids',
      });
    } finally {
      this.commit('auctions/SET_HOT_BIDS_LOADING', false);
    }
  },
  async getTopSellers() {
    try {
      const res = await api.get('reports/top/sellers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const topSellers = res.data as [];
      this.commit('auctions/SET_TOP_SELLERS', topSellers);
    } catch (e) {
      void this.dispatch({
        type: 'auctions/getTopSellers',
      });
    } finally {
      this.commit('auctions/SET_TOP_SELLERS_LOADING', false);
    }
  },
  async getTopBuyers() {
    try {
      const res = await api.get('reports/top/buyers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const TopBuyers = res.data as [];
      this.commit('auctions/SET_TOP_BUYERS', TopBuyers);
    } catch (e) {
      void this.dispatch({
        type: 'auctions/getTopBuyers',
      });
    } finally {
      this.commit('auctions/SET_TOP_BUYERS_LOADING', false);
    }
  },
};

export default actions;
