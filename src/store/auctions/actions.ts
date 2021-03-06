import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import { api } from 'src/boot/axios';
import { IAuctionItem } from 'src/models/IAuctionItem';

const actions: ActionTree<AuctionStateInterface, StateInterface> = {
  async getHotBids() {
    const algopainterAuctionSystemCurrentAddress =
      process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97;
    try {
      const res = await api.get(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `auctions/?ended=false&address=${algopainterAuctionSystemCurrentAddress}&order.expirationDt=1`,
      );
      const hotBids = res.data as [];
      this.commit('auctions/SET_HOT_BIDS', hotBids);
    } catch (e) {
      console.log('Error - getHotBids - auctions actions');
    }
  },
  async getTopSellers() {
    try {
      const res = await api.get('reports/top/sellers');
      const topSellers = res.data as [];
      this.commit('auctions/SET_TOP_SELLERS', topSellers);
    } catch (e) {
      console.log('Error - getTopSellers - auctions actions');
    }
  },
  async getTopBuyers() {
    try {
      const res = await api.get('reports/top/buyers');
      const TopBuyers = res.data as [];
      this.commit('auctions/SET_TOP_BUYERS', TopBuyers);
    } catch (e) {
      console.log('Error - getTopBuyers - auctions actions');
    }
  },

  async getAuctions(type, value: Record<string, unknown>) {
    const account = (value.account as string) || '';
    const collectionOwner = value.collectionOwner as string;
    const itemIndex = value.itemIndex as number;
    const algopainterAuctionSystemCurrentAddress =
      process.env.ALGOPAINTER_AUCTION_SYSTEM_CONTRACT_ADDRESS_97;

    try {
      const res =
        await api.get(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `auctions/?owner=${account}&item.index=${itemIndex}&item.collectionOwner=${collectionOwner}&address=${algopainterAuctionSystemCurrentAddress}`,
        );
      const auctions = res.data as [];
      const auctionsLength = auctions.length;
      // eslint-disable-next-line no-mixed-operators
      if (
        (auctionsLength && collectionOwner) ||
        (auctionsLength && itemIndex)
      ) {
        const lastAuction = auctions[auctionsLength - 1] as IAuctionItem;
        this.commit('auctions/SET_PIRS_AUCTION', lastAuction);
      } else {
        this.commit('auctions/SET_AUCTIONS', auctions);
      }
    } catch (e) {
      console.log('Error - getAuctions - auctions actions');
    }
  },

  async getImagePastOwners(type, value: Record<string, unknown>) {
    const imgId = value.imgId as string;
    try {
      const result = await api.get(`/images/${imgId}/owners`);
      const owners = result.data as [];
      this.commit('auctions/SET_IMAGE_PAST_OWNERS', owners);
    } catch (err) {
      console.log('Error - getImagePastOwners- auctions actions');
    }
  },

  async getBids(type, value: Record<string, unknown>) {
    const account = value.account as string;
    const forBids = value.forBids as boolean;
    try {
      const result = await api.get(`users/${account}/auctions/biding${forBids ? '?forBids=true' : ''}`);
      const bids = result.data as [];
      this.commit('auctions/SET_BIDS', bids);
    } catch (e) {
      console.log('Error - getBids - auctions actions');
    }
  },

  async getBidBack(type, value: Record<string, unknown>) {
    const account = value.account as string;
    const page = value.page as number;
    const perPage = value.perPage as string;
    try {
      const result = await api.get(
        `users/${account}/auctions/biding?forBidbacks=true&page=${page}&perPage=${perPage}&order.expirationDt=1`,
      );
      const bids = result.data as [];
      this.commit('auctions/SET_BIDBACK', bids);
    } catch (e) {
      console.log('Error - getBidBack - auctions actions');
    }
  },

  async getBidBackUpdated(type, value: Record<string, unknown>) {
    const account = value.account as string;
    const collectionOwner = value.collectionOwner as string;
    const itemIndex = value.itemIndex as number;
    try {
      const bids = await api.get(
        `users/${account}/auctions/biding?forBidbacks=true&item.index=${itemIndex}&item.collectionOwner=${collectionOwner}`,
      );
      this.commit('auctions/SET_BIDS_UPDATED', bids);
    } catch (e) {
      console.log('Error - getBidBackUpdated - auctions actions');
    }
  },

  async getPirsUpdated(type, value) {
    const account = value.account as string;
    const collectionOwner = value.collectionOwner as string;
    const itemIndex = value.itemIndex as number;
    try {
      const res = await api.get(`users/${account}/auctions/pirsing?item.index=${itemIndex}&item.collectionOwner=${collectionOwner}`);
      this.commit('auctions/SET_PIRS_UPDATED', res);
    } catch (e) {
      console.log('Error - getPirsUpdated - auctions actions');
    }
  },

  async getOnSale(type, value: { itemId: string }) {
    const itemId = value.itemId;
    try {
      const res = await api.get<IAuctionItem[]>(`auctions?item._id=${itemId}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const auction = res.data.pop();
      if (auction) {
        this.commit('auctions/SET_AUCTION_ID', auction._id);
      }
    } catch (e) {
      console.log('Error - getOnSale - auctions actions');
    }
  },

  openAuctionModal() {
    this.commit('auctions/SET_OPEN_AUCTION_MODAL');
  },

  openBidBackModal(type, value: {auction: IAuctionItem}) {
    this.commit('auctions/SET_OPEN_BID_BACK_MODAL');
    if (value.auction) {
      this.commit('auctions/SET_AUCTION_INFO_BIDBACK', value.auction);
    }
  },

  openBidBackSimulatorModal(type, value: { auction: IAuctionItem }) {
    this.commit('auctions/SET_OPEN_BID_BACK_SIMULATOR_MODAL');
    if (value.auction) {
      this.commit('auctions/SET_AUCTION_INFO_BIDBACK', value.auction);
    }
  },

  openPirsModal(type, value: {auction: IAuctionItem}) {
    this.commit('auctions/SET_OPEN_PIRS_MODAL');
    if (value.auction) {
      this.commit('auctions/SET_AUCTION_INFO_PIRS', value.auction);
    }
  },

  openPirsSimulatorModal(type, value: {auction: IAuctionItem}) {
    this.commit('auctions/SET_OPEN_PIRS_SIMULATOR_MODAL');
    if (value.auction) {
      this.commit('auctions/SET_AUCTION_INFO_PIRS', value.auction);
    }
  },

  updateBidBackStakedAlgop(type, value) {
    this.commit('auctions/UPDATE_BIDBACK_STAKED_ALGOP', value);
  },

  updatePirsStakedAlgop(type, value) {
    this.commit('auctions/UPDATE_PIRS_STAKED_ALGOP', value);
  },
};

export default actions;
