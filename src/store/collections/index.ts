import { Module } from 'vuex';
import { StateInterface } from '../index';
import { CollectionsStateInterface } from './types';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const auctionsModule: Module<CollectionsStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default auctionsModule;
