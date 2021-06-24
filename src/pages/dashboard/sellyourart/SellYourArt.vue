<template>
  <q-page class="row justify-between">
    <div class="col-12 col-sm-6 float-left">
      <div class="q-pa-lg">
        <account-details />
        <div class="header q-gutter-md">
          {{ $t('dashboard.sellYourArt.putMarketplace') }}
        </div>
        <div class="row justify-start ">
          <algo-button
            class="btn-fixed-width q-mr-xs "
            color="primary"
            outline
            :label="$t('dashboard.sellYourArt.FixedPrice')"
          />
          <algo-button
            class="btn-fixed-width"
            color="primary"
            outline
            :label="$t('dashboard.sellYourArt.Timed')"
          />
        </div>
        <div
          text-subtitle2
          class="text-weight-bold q-mt-xs q-gutter-md"
        >
          {{ $t('dashboard.sellYourArt.EnterPrice') }}
        </div>
      </div>
      <div>
        <q-input
          v-model="text"
          type="number"
          color="grey-3"
          label-color="primary"
          :label="$t('dashboard.sellYourArt.price')"
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
                  <q-item-section avatar>
                    <img
                      :src="scope.opt.img"
                    >
                  </q-item-section>
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
        <div class="q-gutter-lg">
          <div class="row justify-start q-gutter-sm">
            <q-select
              v-model="investors"
              class="select-width"
              :options="royalties"
              label="Investors Royalties:"
            >
              <template #append>
                <q-btn
                  round
                  flat
                  icon="%"
                />
              </template>
            </q-select>
            <q-select
              v-model="creator"
              class="select-width"
              :options="royalties"
              label="Creator Royalties:"
            >
              <template #append>
                <q-btn
                  round
                  flat
                  icon="%"
                />
              </template>
            </q-select>
          </div>
          <div class="text-right q-mr-md">
            <p class="text-bold">
              {{ $t('dashboard.sellYourArt.service') }}
            </p>
            <span>
              {{ $t('dashboard.sellYourArt.willReceive') }}
            </span>
            <span
              class="text-primary text-bold"
            >
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
              class="btn-fixed-width  q-ma-xs"
              color="primary"
              outline
              :label="$t('dashboard.sellYourArt.register')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="float-right">
      <you-art />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AlgoButton from 'components/common/Button.vue';

import YouArt from 'components/sellYourArt/YouArt.vue';

@Options({
  components: { AlgoButton, YouArt },
})
export default class sellYourArt extends Vue {
  investors: number = 0;
  creator: number = 0;
  coins: string = '';
  text: string = '';
  options = [
    {
      value: '1',
      label: 'BIN',
      img: 'https://placeimg.com',
    },
    {
      value: '2',
      label: 'BNB',
      img: '~assets/icons/BTC.svg',
    },
    {
      value: '3',
      label: 'ALGOP',
      img: 'https://randomuser.me/api/portraits/',
    },
    {
      value: '4',
      label: 'THE',
      img: 'https://randomuser.me/api/portraits/',
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
}

.select-width {
  width: 200px;
}
</style>
