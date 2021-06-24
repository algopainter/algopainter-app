<template>
  <q-page class="q-page q-gutter-lg q-pb-lg">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-md-11">
            <div class="q-pb-md">
              <algo-button color="primary" outline>
                {{ $t('dashboard.auctionPage.auctionDistribution') }}
              </algo-button>
            </div>
            <q-img
              class="art-image"
              src="../../../assets/placeholder-images/painting.jpg"
            />
          </div>
          <div class="col-md-1">
            <div
              class="
                auction-icons
                col-12 col-md-1
                text-center
                q-pt-md
                flex
                q-gutter-md
                justify-center
              "
            >
              <div>
                <q-icon
                  color="primary"
                  size="1.7rem"
                  name="mdi-heart-outline"
                />
              </div>
              <div>
                <q-icon color="primary" size="1.7rem" name="mdi-arrow-expand" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="auction col-12 col-md-6">

      </div>
    </div>
    <auction-info-chart
      v-if="showAuctionDistribution"
      :values="[44, 100, 13, 33]"
    />
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AuctionInfoChart from 'components/charts/AuctionInfoChart.vue';
import AlgoButton from 'components/common/Button.vue';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { IArt } from 'src/models/IArt';
import { IBid } from 'src/models/IBid';
import moment from 'moment';
import { IUser } from 'src/models/IUser';

@Options({
  components: {
    AuctionInfoChart,
    AlgoButton,
  },
})
export default class Auction extends Vue {
  showAuctionDistribution: boolean = false;

  users: IUser[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice.k@email.com',
      age: '32 years',
      country: 'CA',
      interests: 'digital, fractal, urban, classic',
      collections: 2,
      wallet: {
        algop: 9102,
      },
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '2',
      name: 'Mike',
      email: 'mike@email.com',
      age: '21 years',
      country: 'AR',
      interests: 'classic',
      collections: 7,
      wallet: {
        algop: 6421,
      },
      profilePhotoUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ];

  art: IArt = {
    id: '1',
    name: 'Abstract Art Bind Number 91',
    source: 'placeholder',
    price: 120,
    bidBack: 0.1,
    keywords: '#Art #Algopainter #Creation',
    pirs: {
      creators: 0.15,
      investors: 0.05,
    },
    importantPeople: [
      {
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
      {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      },
      {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      },
    ],
  };

  bids: IBid[] = [
    {
      id: '1',
      user: this.users[0],
      art: this.art,
      price: 4,
      bidAt: moment().subtract(5, 'hours'),
    },
    {
      id: '2',
      user: this.users[1],
      art: this.art,
      price: 4.5,
      bidAt: moment().subtract(2, 'hours'),
    },
    {
      id: '3',
      user: this.users[0],
      art: this.art,
      price: 5,
      bidAt: moment(),
    },
  ];

  auction: IAuctionItem = {
    id: '1',
    bids: this.bids,
    art: this.art,
    numberOfBids: 1,
    highestBid: 300,
  };
}
</script>
<style lang="scss" scoped>
.art-image {
  width: 100%;
  max-width: 850px;
  height: auto;
  border-radius: 10px;
}
</style>
