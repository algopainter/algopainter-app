<template>
  <div class="row justify-center">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="q-pa-md">
        <account-details />
        <div class="header q-gutter-md">
          {{ $t('dashboard.sellYourArt.putMarketplace') }}
        </div>
        <div class="row q-gutter-sm justify-center ">
          <algo-button
            class="btn-fixed-width"
            :class="{ btn1: selectBtn == 1 }"
            :label="$t('dashboard.sellYourArt.FixedPrice')"
            @click="selectBtn = 1"
          />
          <algo-button
            class="btn-fixed-width"
            :class="{ btn2: selectBtn == 2 }"
            :label="$t('dashboard.sellYourArt.Timed')"
            @click="selectBtn = 2"
          />
        </div>
      </div>
      <div v-if="selectBtn === 1">
        <div
          text-subtitle2
          class="text-weight-bold q-mt-xs q-gutter-md q-px-md"
        >
          {{ $t('dashboard.sellYourArt.EnterPrice') }}
        </div>
        <div>
          <span class="text-bold">
            {{ $t('dashboard.sellYourArt.price') }}
          </span>
          <q-input
            v-model="text"
            type="number"
            color="grey-3"
            label-color="primary"
          >
            <template #append>
              <q-select
                v-model="coins"
                :options="options"
              >
                <template #option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <img
                      class="q-mr-xs"
                      :src="scope.opt.img"
                    >

                    <q-item-section>
                      <q-item-label>
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </template>
          </q-input>
          <div>
            <div class="row q-pa-xs">
              <div>
                <span class="text-bold">
                  {{ $t('dashboard.sellYourArt.creatorRoyalties') }}
                </span>
                <q-select
                  v-model="investors"
                  class="select-width q-gutter-x-md"
                  :options="royalties"
                >
                  <template #append>
                    <q-btn flat>
                      {{ $t('dashboard.sellYourArt.percent') }}
                    </q-btn>
                  </template>
                </q-select>
              </div>
              <div>
                <span class="text-bold">
                  {{ $t('dashboard.sellYourArt.investorsRoyalties') }}</span>
                <q-select
                  v-model="creator"
                  class="select-width"
                  :options="royalties"
                >
                  <template #append>
                    <q-btn flat>
                      {{ $t('dashboard.sellYourArt.percent') }}
                    </q-btn>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="text-right q-mr-md">
              <p class="text-bold">
                {{ $t('dashboard.sellYourArt.service') }}
              </p>
              <span>
                {{ $t('dashboard.sellYourArt.willReceive') }}
              </span>
              <span class="text-primary text-bold">
                {{ $t('dashboard.sellYourArt.ireceive') }}
              </span>
              <span class="text-primary text-bold">
                {{ coins.label }}
              </span>
              <span class="text-grey-5">
                {{ $t('dashboard.sellYourArt.money') }}
              </span>
            </div>
            <div class="row justify-center">
              <algo-button
                class="btn-fixed-width q-ma-xs"
                color="primary"
                outline
                :label="$t('dashboard.sellYourArt.cancel')"
              />
              <algo-button
                class="btn-fixed-width q-ma-xs"
                color="primary"
                outline
                :label="$t('dashboard.sellYourArt.register')"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectBtn === 2">
        <!-- page sell auction -->
      </div>
    </div>
    <div>
      <your-art class="q-ma-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AlgoButton from 'components/common/Button.vue';

import YourArt from 'src/components/sellYourArt/YourArt.vue';

@Options({
  components: { AlgoButton, YourArt },
})
export default class sellYourArt extends Vue {
  investors: null = null;
  creator: null = null;
  coins: string = '';
  text: string = '';
  selectBtn: number = 1;

  options = [
    {
      value: '1',
      label: 'BTC',
      img: '/images/BTC.svg',
    },
    {
      value: '2',
      label: 'BNB',
      img: '/images/BNB.svg',
    },
    {
      value: '3',
      label: 'ALGOP',
      img: '/images/ALGOP.svg',
    },
    {
      value: '4',
      label: 'ETH',
      img: '/images/ETH.svg',
    },
    {
      value: '5',
      label: 'DASH',
      img: '/images/DASH.svg',
    },
  ];

  royalties = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 2.5,
      label: '2.5',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
  ];
}
</script>

<style lang="scss" scoped>
.btn-fixed-width {
  width: 100px;
  height: 44px;
  color: #f4538d;
  border: 1px solid rgb(185, 185, 185);
}

.btn-fixed-width.btn1 {
  border: 1px solid #f4538d;
  color: #f4538d;
}

.btn-fixed-width.btn2 {
  border: 1px solid #f4538d;
  color: #f4538d;
}

.select-width {
  width: 200px;
}
</style>
