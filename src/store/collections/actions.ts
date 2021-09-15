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
    const currentCollection = (collectionName === undefined || collectionName.toLowerCase() === 'all collections') ? '' : collectionName;
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection}`);
      const userItems: string = res.data.count;
      const images: [] = res.data;
      this.commit('collections/SET_USER_ITEMS', userItems);
      this.commit('collections/SET_IMAGES', images);
    } catch (e) {
      console.log('error message - getUserItems');
    }
  },
  async getAllCollections(type, value) {
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
    const currentCollection = (collectionName === undefined || collectionName.toLowerCase() === 'all collections') ? '' : collectionName;
    try {
      const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${currentCollection}`); // &onSale=true
      const images: [] = res.data;
      this.commit('collections/SET_USER_ON_SALE', images);
    } catch (e) {
      console.log('error message - getUserItems');
    }
  },
};

export default actions;
