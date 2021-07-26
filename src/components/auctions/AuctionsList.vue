<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header">
      {{ $t('dashboard.auctions.hotBids') }}
    </div>
    <div
      v-if="loadingHotBids === false"
      class="flex q-col-gutter-md">
      <auction-item
        v-for="isHot in areHot"
        :key="isHot._id"
        :is-hot="isHot"
        @favoriteClicked="favoriteClicked()"
      />
    </div>
    <div class="row q-pt-xl">
      <div class="header">
        <i18n-t keypath="dashboard.auctions.topSellers.top">
          <template #sellers>
            <span class="text-primary">
              {{ currentOptionsTop.label }}
            </span>
          </template>
        </i18n-t>
      </div>
      <div>
        <q-select
          v-model="currentOptionsTop"
          hide-selected
          class="text-primary"
          borderless
          :options="optionsTop"
          behavior="menu"
          dense
        />
      </div>
    </div>
    <div v-if="currentOptionsTop.id === 1">
      <div
        v-if="loadingTopSellers === false"
        class="top-sellers q-pb-xl"
      >
        <div class="flex q-col-gutter-xl">
          <div
            v-for="(seller, index) in TopSellers"
            :key="index"
          >
            <div class="flex q-col-gutter-md items-center">
              <div class="text-h6 text-bold">
                {{ index + 1 }}
              </div>
              <div>
                <q-avatar
                  round
                  size="64px"
                >
                  <img :src="seller.avatar">
                </q-avatar>
              </div>
              <div>
                <div class="text-h5 text-bold">
                  {{ seller.name }}
                </div>
                <div>{{ $n(seller.amount, 'currency',) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentOptionsTop.id === 2">
      <div
        v-if="loadingTopBuyers === false"
        class="top-sellers q-pb-xl"
      >
        <div class="flex q-col-gutter-xl">
          <div
            v-for="(seller, index) in TopBuyers"
            :key="index"
          >
            <div class="flex q-col-gutter-md items-center">
              <div class="text-h6 text-bold">
                {{ index + 1 }}
              </div>
              <div>
                <q-avatar
                  round
                  size="64px"
                >
                  <img :src="seller.avatar">
                </q-avatar>
              </div>
              <div>
                <div class="text-h5 text-bold">
                  {{ seller.name }}
                </div>
                <div>{{ $n(seller.amount, 'currency') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="explore-results flex q-col-gutter-md">
      <auction-item
        v-for="auction in auctions"
        :key="auction.id"
        :auction="auction"
        @favoriteClicked="favoriteClicked"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
import { ITopSellersBuyers } from 'src/models/ITopSellersBuyers';
import { AuctionItem } from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';
import { api } from 'src/boot/axios';

@Options({
  components: {
    AuctionItem,
    AlgoButton,
  },
})
export default class AuctionsList extends Vue {
  TopSellers: ITopSellersBuyers[] = [];
  TopBuyers: ITopSellersBuyers[] = [];
  areHot: IAuctionItem2[] = [];
  loadingHotBids: boolean = true;
  loadingTopSellers: boolean = true;
  loadingTopBuyers: boolean = true;

  mounted() {
    void this.getDataHotBids();
    void this.getDataTopSellers();
    void this.getDataTopBuyers();
  }

  async getDataHotBids() {
    try {
      const data = await api.get('auctions?page=1&perPage=4&isHot=true');
      console.log(data.data.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.areHot = data.data.data as [];
      this.loadingHotBids = false;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getDataTopSellers() {
    try {
      const data = await api.get('reports/top/sellers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.TopSellers = data.data as [];
      this.loadingTopSellers = false;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getDataTopBuyers() {
    try {
      const data = await api.get('reports/top/buyers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.TopBuyers = data.data as [];
      this.loadingTopBuyers = false;
    } catch (e) {
      console.log('e', e);
    }
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  categories: unknown[] = [{
    id: '1',
    label: 'Digital',
  }, {
    id: '2',
    label: 'Photo',
  }, {
    id: '3',
    label: 'Classic',
  }, {
    id: '4',
    label: 'Modern',
  }, {
    id: '5',
    label: 'Abstract',
  }, {
    id: '6',
    label: 'Fractal',
  }];

  optionsTop: unknown[] = [
    {
      id: 1,
      label: 'Sellers',
    },
    {
      id: 2,
      label: 'Buyers',
    },
  ]

  currentOptionsTop: unknown = {
    id: 1,
    label: 'Sellers',
  }
}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.header.gallery{
  padding-bottom: 1rem;
}
</style>
