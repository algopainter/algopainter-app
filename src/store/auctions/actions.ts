import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import { api } from 'src/boot/axios';
import { IAuctionItem } from 'src/models/IAuctionItem';

const actions: ActionTree<AuctionStateInterface, StateInterface> = {
  async getHotBids() {
    const algopainterAuctionSystemCurrentAddress = process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97;
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`auctions/?ended=false&address=${algopainterAuctionSystemCurrentAddress}&order.expirationDt=1`);
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
      const TopBuyers = res.data as [];
      this.commit('auctions/SET_TOP_BUYERS', TopBuyers);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },

  async getAuctions(type, value: Record<string, unknown>) {
    const account = value.account as string || '';
    const collectionOwner = value.collectionOwner as string;
    const itemIndex = value.itemIndex as number;
    const algopainterAuctionSystemCurrentAddress = process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97;

    try {
      const res =
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        await api.get(`auctions/${account}?item.index=${itemIndex}&item.collectionOwner=${collectionOwner}&address=${algopainterAuctionSystemCurrentAddress}`);
      const auctions = res.data as [];
      const auctionsLength = auctions.length;
      // eslint-disable-next-line no-mixed-operators
      if (auctionsLength && collectionOwner || auctionsLength && itemIndex) {
        const lastAuction = auctions[auctionsLength - 1] as IAuctionItem;
        console.log('lastAuction', lastAuction);
        this.commit('auctions/SET_PIRS_AUCTION', lastAuction);
      } else {
        this.commit('auctions/SET_AUCTIONS', auctions);
      }
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },

  async getImagePastOwners(type, value: Record<string, unknown>) {
    const imgId = value.imgId as string;
    try {
      const result = await api.get(`/images/${imgId}/owners`);
      const owners = result.data as [];
      console.log('owners', owners);
      this.commit('auctions/SET_IMAGE_PAST_OWNERS', owners);
    } catch (err) {
      console.log('error getImagePastOwners');
    } finally {
      console.log('sucess msg getImagePastOwners');
    }
  },

  async getBids(type, value: Record<string, unknown>) {
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

  async getBidBack(type, value: Record<string, unknown>) {
    const account = value.account as string;
    const page = value.page as number;
    const perPage = value.perPage as string;
    try {
      const result =
        await api.get(`users/${account}/auctions/biding/?page=${page}&perPage=${perPage}&order.expirationDt=-1`);
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

  openBidBackModal(type, value: {auctionId: string, auctionIndex: number}) {
    this.commit('auctions/SET_OPEN_BID_BACK_MODAL');
    this.commit('auctions/SET_BID_BACK_ID', value.auctionId);
    this.commit('auctions/SET_BID_BACK_INDEX', value.auctionIndex);
  },

  openPirsModal(type, value: {auctionId: string, auctionIndex: number}) {
    this.commit('auctions/SET_OPEN_PIRS_MODAL');
    this.commit('auctions/SET_PIRS_ID', value.auctionId);
    this.commit('auctions/SET_PIRS_INDEX', value.auctionIndex);
  },
};

export default actions;
