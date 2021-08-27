<template>
  <div
    v-if="loading"
    class="flex flex-center q-pa-xl"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div
    v-else
    class="row reverse-sm q-col-gutter-lg"
  >
    <div
      v-if="image"
      class="col-12 col-sm-4 image-preview"
    >
      <div>
        <q-img :src="image.nft.previewImage" />
      </div>
      <div class="title">
        {{ image.title }}
      </div>
      <div class="description">
        {{ image.description }}
      </div>
    </div>
    <div class="col-12 col-sm-8">
      <div class="row q-col-gutter-md">
        <div class="col-12 header">
          {{ $t('dashboard.sellYourArt.createAuction') }}
        </div>
        <div class="col-12">
          <q-input
            v-model="auction.minimumPrice"
            :label="$t('dashboard.sellYourArt.minimumPrice')"
            type="number"
            color="primary"
          >
            <template #append>
              <q-btn-dropdown
                color="primary"
                flat
                :label="selectedCoinLabel"
              >
                <q-list>
                  <q-item
                    v-for="option in options"
                    :key="option.value"
                    v-close-popup
                    clickable
                    @click="selectCoin(option.value)"
                  >
                    <q-item-section avatar>
                      <q-avatar size="sm">
                        <img :src="option.img">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ option.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <date-time-field
            v-model="auction.endDate"
            :options="endDateOptions"
            :label="$t('dashboard.sellYourArt.endDate')"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="auction.bidBackFee"
            type="number"
            :label="$t('dashboard.sellYourArt.bidBackFee')"
          />
        </div>
        <div class="col-12 flex justify-end">
          <algo-button
            color="primary"
            :label="$t('dashboard.sellYourArt.createAuction')"
            @click="createAuction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

import { getImage } from 'src/api/images';
import { IImage } from 'src/models/IImage';
import AlgoButton from 'components/common/Button.vue';
import DateTimeField from 'components/fields/DateTimeField.vue';

interface INewAuction {
  minimumPrice: number;
  endDate: string;
  coin: string;
  bidBackFee: number;
}

@Options({
  components: {
    AlgoButton,
    DateTimeField,
  },
})
export default class SellYourArt extends Vue {
  image: IImage | null = null;
  loading: boolean = false;

  auction: INewAuction = {
    minimumPrice: 0,
    endDate: '',
    coin: '',
    bidBackFee: 0,
  };

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

  get selectedCoinLabel() {
    const { coin } = this.auction;

    if (!coin) {
      return this.$t('dashboard.sellYourArt.selectCoin');
    }

    const selectedOption = this.options.find((option) => option.value === coin);

    if (!selectedOption) {
      return coin;
    }

    return selectedOption.label;
  }

  get nowFormatted() {
    return moment().format('YYYY/MM/DD');
  }

  created() {
    void this.loadImage();
  }

  async loadImage() {
    const { id } = this.$route.params;

    this.loading = true;

    this.image = await getImage(id as string);

    this.loading = false;
  }

  selectCoin(coin: string) {
    this.auction.coin = coin;
  }

  endDateOptions(date: string) {
    return date > this.nowFormatted;
  }

  createAuction() {}
}
</script>

<style lang="scss" scoped>
.image-preview {
  .title {
    font-weight: bold;
    font-size: 1.8rem;
  }
}
</style>
