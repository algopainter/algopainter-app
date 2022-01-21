import { Module } from 'vuex';
import { StateInterface } from '../index';
import MintStateInterface from './types';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const mintModule: Module<MintStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default mintModule;
