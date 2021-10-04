import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import { api } from 'src/boot/axios';
import { IAuctionItem } from 'src/models/IAuctionItem';

const actions: ActionTree<AuctionStateInterface, StateInterface> = {
  async getHotBids() {
    try {
      const res = await api.get('auctions/?ended=false&order.expirationDt=1');
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

  async getAuctions(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const id = value.id as string;
    try {
      const res = await api.get(`auctions/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const auctions = res.data as [];
      this.commit('auctions/SET_AUCTIONS', auctions);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },

  async getBids(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const account = value.account as string;

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

  async getOnSale(type, value: {itemId: string}) {
    const itemId = value.itemId;
    try {
      const res = await api.get<IAuctionItem[]>(`auctions?item._id=${itemId}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const auction = res.data.pop();
      if (auction) {
        this.commit('auctions/SET_AUCTION_ID', auction._id);
      }
    } catch (e) {
      console.log('Error in getOnSale');
    }
  },

  openAuctionModal() {
    this.commit('auctions/SET_OPEN_AUCTION_MODAL');
  },

  openBidBackModal() {
    this.commit('auctions/SET_OPEN_BID_BACK_MODAL');
  },
};

export default actions;
