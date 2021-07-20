<template>
  <div>
    <div class="row q-col-gutter-xl items-center">
      <div class="col-12 col-sm-6 col-xl-8">
        <div class="user-info flex items-center q-col-gutter-lg">
          <div class="picture">
            <q-img
              src="../../assets/placeholder-images/user.png"
              class="picture-content"
            />
          </div>
          <div class="user-details">
            <div class="name text-primary text-bold text-h3">
              {{ user.name }}
            </div>
            <div class="details">
              {{ user.email }}
            </div>
            <div class="details">
              {{ user.age }}
            </div>
            <div class="details text-grey-5">
              {{ user.interests }}
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-col-gutter-md">
          <div class="col-6 col-sm-auto btn-edit">
            <algo-button
              class="full-width btn-edit"
              size="lg"
              color="primary"
              to="/edit-profile"
            >
              {{ $t('dashboard.homePage.editAccount') }}
            </algo-button>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-lg-6 text-primary text-center">
            <div class="text-h3 text-bold">
              {{ $t('dashboard.homePage.collection') }}
            </div>
            <div class="text-h1 text-bold q-py-xl">
              {{ user.collections }}
            </div>
          </div>
          <div class="col-12 col-lg-6 text-secondary text-center">
            <div class="text-h3 text-bold">
              {{ $t('common.coinSymbol') }}
            </div>
            <div class="text-h1 text-bold q-py-xl">
              {{ $n(user.wallet.algop) }}
            </div>
            <algo-button
              size="lg"
              color="primary"
              type="a"
              href="https://exchange.pancakeswap.finance/#/
              swap?outputCurrency=0xbee554dbbc677eb9fb711f5e939a2f2302598c75"
              target="_blank"
            >
              {{ $t('dashboard.homePage.buyAlgop') }}
            </algo-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IUser } from 'src/models/IUser';
import AlgoButton from '../common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})
export default class AccountDetails extends Vue {
  user: IUser = {
    id: '1',
    name: 'Natasha',
    email: 'natasha.k@gmail.com',
    age: '27 years',
    interests: 'abstract, modern, digital, fractal, urban, classic',
    collections: 8,
    wallet: {
      algop: 1302,
    },
  };
}
</script>

<style lang="scss" scoped>
.user-info {
  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
    justify-content: center;
  }

  .picture-content {
    border-radius: 100rem;
    height: 230px;
    width: 230px;
  }

  .user-details {
    .details {
      padding: 2px 0;
      font-size: 1.3rem;
    }

    .country-flag {
      display: inline-flex;
      align-items: center;

      img {
        display: block;
        height: 20px;
        margin-right: 6px;
      }
    }
  }
}
.btn-edit{
   @media (max-width: $breakpoint-xs-max){
    width: 100%;
   }
}
</style>
