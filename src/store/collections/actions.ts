/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CollectionsStateInterface } from './types';
import { api } from 'src/boot/axios';

const actions: ActionTree<CollectionsStateInterface, StateInterface> = {
  async getUserItems(type, value) {
    const account = value.account as string;
    try {
      const res = await api.get(`users/${account}/images`);
      const userItems: string = res.headers['x-total-items'];
      this.commit('collections/SET_USER_ITEMS', userItems);
    } catch (e) {
      console.log('error msg');
    } finally {
      console.log('success msg');
    }
  },
};

export default actions;
