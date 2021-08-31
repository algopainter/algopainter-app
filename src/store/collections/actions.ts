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
    let collectionName = value.collectionName as string;
    try {
      console.log('collectionName', collectionName);
      if (collectionName === undefined || collectionName.toLowerCase() === 'all collections') {
        collectionName = '';
        console.log('in');
      }
      const res = await api.get(`users/${account}/images?page=${page}&perPage=${perPage}&collectionName=${collectionName}`);
      const userItems: string = res.data.count;
      const images: [] = res.data;
      this.commit('collections/SET_USER_ITEMS', userItems);
      this.commit('collections/SET_IMAGES', images);
    } catch (e) {
      console.log('error message - getUserItems');
    }
  },
};

export default actions;
