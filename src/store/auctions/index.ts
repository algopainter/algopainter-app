import { Module } from 'vuex';
import { StateInterface } from '../index';
import { AuctionStateInterface } from './types';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const auctionsModule: Module<AuctionStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default auctionsModule;
