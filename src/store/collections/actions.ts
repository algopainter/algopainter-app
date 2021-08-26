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
    try {
      const res = await api.get(`users/${account}/images?page=${page}&perPage=9`);
      const userItems: string = res.data.count;
      this.commit('collections/SET_USER_ITEMS', userItems);
    } catch (e) {
      console.log('error msg');
    }
  },
};

export default actions;
