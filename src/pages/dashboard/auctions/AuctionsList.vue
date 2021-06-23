<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header">
      {{ $t('dashboard.auctions.hotBids') }}
    </div>
    <div class="flex q-col-gutter-md">
      <auction-item
        v-for="auction in auctions"
        :key="auction.id"
        :auction="auction"
      />
    </div>
    <div class="header q-pt-xl">
      <i18n-t keypath="dashboard.auctions.topSellers.top">
        <template #sellers>
          <span class="text-primary">
            {{ $t('dashboard.auctions.topSellers.sellers') }}
          </span>
        </template>
      </i18n-t>
    </div>
    <div class="top-sellers q-pb-xl">
      <div class="flex q-col-gutter-xl">
        <div
          v-for="seller, index in topSellers"
          :key="seller.id"
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
                <img :src="seller.picture">
              </q-avatar>
            </div>
            <div>
              <div class="text-h5 text-bold">
                {{ seller.name }}
              </div>
              <div>{{ `${seller.sellValue} ALGOP` }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="header q-pr-xl">
        {{ $t('dashboard.auctions.explore') }}
      </div>
      <div class="categories flex col-grow q-col-gutter-md">
        <div
          v-for="category in categories"
          :key="category.id"
        >
          <algo-button
            class="category"
            size="lg"
            color="primary"
            outline
          >
            {{ category.label }}
          </algo-button>
        </div>
        <q-space />
        <div>
          <algo-button
            class="category"
            size="lg"
            color="primary"
            outline
            icon-right="mdi-filter-outline"
            :label="$t('dashboard.auctions.otherFilter')"
          />
        </div>
      </div>
    </div>
    <div class="explore-results flex q-col-gutter-md">
      <auction-item
        v-for="auction in auctions"
        :key="auction.id"
        :auction="auction"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import {
  AuctionItem,
} from 'components/auctions';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AuctionItem,
    AlgoButton,
  },
})
export default class AuctionsList extends Vue {
  auctions: IAuctionItem[] = [{
    id: '1',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    numberOfBids: 1,
    highestBid: 300,
  }, {
    id: '2',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    numberOfBids: 1,
    highestBid: 300,
  }, {
    id: '3',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    numberOfBids: 1,
    highestBid: 300,
  }, {
    id: '4',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    numberOfBids: 1,
    highestBid: 300,
  }];

  topSellers: unknown[] = [{
    id: '1',
    name: 'Amy',
    sellValue: 3450,
    picture: 'https://randomuser.me/api/portraits/women/73.jpg',
  }, {
    id: '2',
    name: 'Roland',
    sellValue: 3450,
    picture: 'https://randomuser.me/api/portraits/men/51.jpg',
  }, {
    id: '3',
    name: 'Leona',
    sellValue: 3450,
    picture: 'https://randomuser.me/api/portraits/women/77.jpg',
  }, {
    id: '4',
    name: 'Perry',
    sellValue: 3450,
    picture: 'https://randomuser.me/api/portraits/men/77.jpg',
  }, {
    id: '5',
    name: 'Kylie',
    sellValue: 3450,
    picture: 'https://randomuser.me/api/portraits/women/44.jpg',
  }];

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
}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}
</style>
