import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { UserStateInterface } from './user/types';
import { AuctionStateInterface } from './auctions/types';
import { CollectionsStateInterface } from './collections/types';
import MintStateInterface from './mint/types';
import user from './user';
import auctions from './auctions';
import collections from './collections';
import mint from './mint';

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue.
  // Best to strongly type as per the line above.
  example: unknown;
  user: UserStateInterface;
  auctions: AuctionStateInterface;
  collections: CollectionsStateInterface;
  mint: MintStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

let myStore: VuexStore<StateInterface>;

export default store(function(/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      // example
      user,
      auctions,
      collections,
      mint,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });
  myStore = Store;
  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}

export { myStore };
