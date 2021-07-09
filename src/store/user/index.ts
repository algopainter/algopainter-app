import { Module } from 'vuex';
import { StateInterface } from '..';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { UserStateInterface } from './types';
import state from './state';

const userModule: Module<UserStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state,
};

export default userModule;
