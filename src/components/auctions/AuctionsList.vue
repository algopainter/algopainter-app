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
    <div
      v-if="currentOptionsTop.id == 1"
      class="top-sellers q-pb-xl"
    >
      <div class="flex q-col-gutter-xl">
        <div
          v-for="seller, index in buyTopSellers"
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
              <div>{{ $n(seller.sellValue, 'currency',) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="currentOptionsTop.id == 2"
      class="top-sellers q-pb-xl"
    >
      <div class="flex q-col-gutter-xl">
        <div
          v-for="seller, index in sellTopSellers"
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
              <div>{{ $n(seller.sellValue, 'currency') }}</div>
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
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import { AuctionItem } from 'components/auctions';
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
      keywords: '#art',
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
      id: '2',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
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
      id: '3',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
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
      id: '4',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
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

  buyTopSellers: unknown[] = [{
    id: '1',
    name: 'Amy',
    sellValue: 10000,
    picture: 'https://randomuser.me/api/portraits/women/73.jpg',
  }, {
    id: '2',
    name: 'Roland',
    sellValue: 3050,
    picture: 'https://randomuser.me/api/portraits/men/51.jpg',
  }, {
    id: '3',
    name: 'Leona',
    sellValue: 2650,
    picture: 'https://randomuser.me/api/portraits/women/77.jpg',
  }, {
    id: '4',
    name: 'Perry',
    sellValue: 2450,
    picture: 'https://randomuser.me/api/portraits/men/77.jpg',
  }, {
    id: '5',
    name: 'Kylie',
    sellValue: 2150,
    picture: 'https://randomuser.me/api/portraits/women/44.jpg',
  }];

  sellTopSellers: unknown[] = [{
    id: '1',
    name: 'Jess',
    sellValue: 11450,
    picture: 'https://randomuser.me/api/portraits/women/50.jpg',
  }, {
    id: '2',
    name: 'Fergus',
    sellValue: 8450,
    picture: 'https://randomuser.me/api/portraits/men/30.jpg',
  }, {
    id: '3',
    name: 'Vif',
    sellValue: 6450,
    picture: 'https://randomuser.me/api/portraits/women/20.jpg',
  }, {
    id: '4',
    name: 'Therry',
    sellValue: 5450,
    picture: 'https://randomuser.me/api/portraits/men/10.jpg',
  }, {
    id: '5',
    name: 'Kyle',
    sellValue: 5250,
    picture: 'https://randomuser.me/api/portraits/women/66.jpg',
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
