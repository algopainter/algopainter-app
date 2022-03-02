/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CollectionsStateInterface } from './types';
import { api } from 'src/boot/axios';

const actions: ActionTree<CollectionsStateInterface, StateInterface> = {
  async getUserItems(type, value) {
    const account = value.account as string;
    const page = value.page as string;
    const perPage = value.perPage as string;
    const collectionName = value.collectionName as string;
    const currentCollection =
      collectionName === undefined ||
      collectionName.toLowerCase() === 'all collections'
        ? ''
        : collectionName;
    try {
      if (currentCollection === 'Personal Item') {
        const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection.replace(/\s/g, '')}&onSale=false`);
        const userItems: string = res.data.count;
        const images: [] = res.data;
        this.commit('collections/SET_USER_ITEMS', userItems);
        this.commit('collections/SET_IMAGES', images);
      } else {
        const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection}&onSale=false`);
        const userItems: string = res.data.count;
        const images: [] = res.data;
        this.commit('collections/SET_USER_ITEMS', userItems);
        this.commit('collections/SET_IMAGES', images);
      }
    } catch (e) {
      console.log('error message - getUserItems');
    }
  },
  async getAllCollections() {
    try {
      const res = await api.get('collections');
      this.commit('collections/SET_COLLECTIONS', res);
    } catch (e) {
      console.log('error message - allCollections');
    }
  },
  async getUserOnSale(type, value) {
    const account = value.account as string;
    const page = value.page as string;
    const perPage = value.perPage as string;
    const collectionName = value.collectionName as string;
    const currentCollection =
      collectionName === undefined ||
      collectionName.toLowerCase() === 'all collections'
        ? ''
        : collectionName;
    try {
      const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection}&onSale=true&includeExpired=true`);
      const images: [] = res.data;
      this.commit('collections/SET_USER_ON_SALE', images);
    } catch (e) {
      console.log('error message - getUserItems');
    }
  },
  async getUserOnSalePublic(type, value) {
    const account = value.account as string;
    const page = value.page as string;
    const perPage = value.perPage as string;
    const collectionName = value.collectionName as string;
    const currentCollection =
      collectionName === undefined ||
      collectionName.toLowerCase() === 'all collections'
        ? ''
        : collectionName;
    try {
      const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection}&onSale=true&includeExpired=false`);
      const images: [] = res.data;
      this.commit('collections/SET_USER_ON_SALE_PUBLIC', images);
    } catch (e) {
      console.log('error message - getUserItemsPublic');
    }
  },
  async getUserPastImages(type, value) {
    const account = value.account as string;
    const page = value.page as string;
    const perPage = value.perPage as string;
    try {
      const res = await api.get(`histories/owners/${account}/images?page=${page}&perPage=${perPage}&order.onSale=-1`);
      const history: [] = res.data;
      this.commit('collections/SET_USER_PAST_IMAGES', history);
    } catch (e) {
      console.log('error message - getUserPastImages');
    }
  },
  async getUserPirsTabImages(type, value) {
    const account = value.account as string;
    const page = value.page as string;
    const perPage = value.perPage as string;
    try {
      const res = await api.get(`users/${account}/auctions/pirsing?page=${page}&perPage=${perPage}&order.onSale=-1`);
      const images: [] = res.data;
      this.commit('collections/SET_USER_PIRS_TAB_IMAGES', images);
    } catch (e) {
      console.log('error message - getUserPirsTabImages');
    }
  },
  async getImagePastOwners(type, value) {
    const id = value.id as string;
    try {
      const res = await api.get(`histories/images/${id}/owners`);
      const history: [] = res.data;
      this.commit('collections/SET_IMAGE_PAST_OWNERS', history);
    } catch (e) {
      console.log('error message - getUserPastImages');
    }
  },
  openNewPaintingModal() {
    this.commit('collections/SET_OPEN_NEW_PAINTING_MODAL');
  },
};

export default actions;
