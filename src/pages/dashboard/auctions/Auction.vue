<template>
  <q-page class="q-page q-gutter-lg q-pb-lg">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="row">
          <div class="col-md-11">
            <div class="q-pb-md">
              <algo-button
                color="primary"
                outline
                @click="auctionDistributionBtnClicked()"
              >
                {{ $t('dashboard.auctionPage.auctionDistribution') }}
              </algo-button>
            </div>
            <q-img
              v-if="isAuctionImageEnabled"
              class="art-image"
              src="../../../assets/placeholder-images/painting.jpg"
            />
            <auction-info-chart
              v-if="isAuctionDistributionEnabled"
              :values="[44, 100, 13, 33]"
            />
          </div>
          <div class="col-md-1">
            <div
              class="
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
        <div class="row q-col-gutter-lg q-pb-lg">
          <div class="auction-details col-md-8">
            <div class="name">
              {{ auction.art.name }}
            </div>
            <div class="q-py-xs">
              {{
                $t('dashboard.auctionPage.saleNumber', {
                  saleNumber: saleNumber,
                  totalSales: totalSales,
                })
              }}
            </div>
            <div class="keywords">
              {{ auction.art.keywords }}
            </div>
          </div>
          <div class="bid-back col-md-4">
            <span class="dot"></span>
          </div>
        </div>
        <div>
          <q-tabs
            v-model="tab"
            active-color="primary"
            indicator-color="primary"
            align="left"
            :narrow-indicator="true"
          >
            <q-tab :ripple="false" no-caps name="info" label="Info" />
            <q-tab :ripple="false" no-caps name="bids" label="Bids" />
            <q-tab
              :ripple="false"
              no-caps
              name="previous-owners"
              :label="$t('dashboard.auctionPage.previousOwners')"
            />
            <q-tab :ripple="false" no-caps name="history" label="History" />
          </q-tabs>

          <q-tab-panels v-model="tab">
            <q-tab-panel name="info" class="q-pa-sm">
              <algo-avatar
                class="q-py-md"
                :title="$t('dashboard.auctionPage.owner')"
                :imageUrl="owner.profilePhotoUrl"
                :subTitle="owner.name"
              />
              <algo-avatar
                class="q-py-md"
                v-for="creator in creators"
                :key="creator.id"
                :title="$t(`dashboard.auctionPage.creator`)"
                :imageUrl="creator.profilePhotoUrl"
                :subTitle="creator.name"
                :description="
                  $t('dashboard.auctionPage.pirsDestination', {
                    pirs: $n(auction.art.pirs.creators, 'percent'),
                    role: $t('dashboard.auctionPage.creators').toLowerCase(),
                  })
                "
              />
              <q-separator class="q-pr-xl" spaced="md" color="primary" />
              <algo-avatar
                class="q-py-md"
                :title="$t('dashboard.auctionPage.collection')"
                :imageUrl="collection.imageUrl"
                :subTitle="collection.name"
                :description="
                  $t('dashboard.auctionPage.pirsDestination', {
                    pirs: $n(auction.art.pirs.investors, 'percent'),
                    role: $t('dashboard.auctionPage.investors').toLowerCase(),
                  })
                "
              />
            </q-tab-panel>

            <q-tab-panel name="bids" class="q-pa-sm">
              <bid-avatar
                class="q-py-md"
                v-for="bid in bids"
                :bid="bid"
                :key="bid.id"
              />
            </q-tab-panel>

            <q-tab-panel name="previous-owners" class="q-pa-sm">
              <algo-avatar
                class="q-py-md"
                v-for="oldOwner in oldOwners"
                :key="oldOwner.id"
                :title="$t('dashboard.auctionPage.oldOwner')"
                :imageUrl="oldOwner.profilePhotoUrl"
                :subTitle="oldOwner.name"
              />
            </q-tab-panel>

            <q-tab-panel name="history" class="q-pa-sm">
              <previous-bid-avatar
                class="q-py-md"
                v-for="bid in bids"
                :bid="bid"
                :key="bid.id"
              />
            </q-tab-panel>
          </q-tab-panels>

          <div>
            <div class="q-pt-md">
              <highest-bid-avatar :bid="highestBid" />
            </div>
            <div class="q-pr-xl q-py-sm">
              <algo-button
                class="text-bold full-width"
                size="lg"
                color="primary"
                outline
              >
                Place a Bid
              </algo-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AuctionInfoChart from 'components/charts/AuctionInfoChart.vue';
import AlgoAvatar from 'components/common/AlgoAvatar.vue';
import BidAvatar from 'components/auctions/auction/BidAvatar.vue';
import HighestBidAvatar from 'components/auctions/auction/HighestBidAvatar.vue';
import PreviousBidAvatar from 'components/auctions/auction/PreviousBidAvatar.vue';
import AlgoButton from 'components/common/Button.vue';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { IArt } from 'src/models/IArt';
import { IBid } from 'src/models/IBid';
import moment from 'moment';
import { IUser } from 'src/models/IUser';

interface ITempUser {
  id: string;
  name: string;
  profilePhotoUrl: string;
}

interface ICollection {
  name: string;
  imageUrl: string;
}

@Options({
  components: {
    AuctionInfoChart,
    AlgoButton,
    BidAvatar,
    HighestBidAvatar,
    AlgoAvatar,
    PreviousBidAvatar,
  },
})
export default class Auction extends Vue {
  
  isAuctionImageEnabled: boolean = true;

  isAuctionDistributionEnabled: boolean = false;

  auctionDistributionBtnClicked() {
    this.isAuctionImageEnabled = !this.isAuctionImageEnabled;
    this.isAuctionDistributionEnabled = !this.isAuctionDistributionEnabled;
  }
  
  tab: string = 'info';

  // MOCKING DATA

  totalSales: number = 12;

  saleNumber: number = 4;

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

  owner: ITempUser = {
    id: '4',
    name: 'Dave',
    profilePhotoUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
  };

  creators: ITempUser[] = [
    {
      id: '1',
      name: 'Michonne',
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '2',
      name: 'Jordan',
      profilePhotoUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ];

  collection: ICollection = {
    name: 'ArTbs',
    imageUrl: 'http://localhost:8080/img/painting.jpg',
  };

  oldOwners: ITempUser[] = [
    {
      id: '10',
      name: 'Dave',
      profilePhotoUrl: 'https://randomuser.me/api/portraits/men/26.jpg',
    },
    {
      id: '11',
      name: 'Keyne',
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    },
    {
      id: '12',
      name: 'Alice',
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/41.jpg',
    },
  ];

  highestBidUser: ITempUser = {
    id: '590',
    name: 'MattPress',
    profilePhotoUrl: 'https://randomuser.me/api/portraits/women/73.jpg',
  };

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
      price: 5,
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
      price: 4,
      bidAt: moment(),
    },
  ];

  highestBid: IBid = {
    id: '6',
    user: this.highestBidUser as IUser,
    art: this.art,
    price: 120,
    bidAt: moment().subtract(10, 'hours'),
  };

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

.auction {
  border-left: 2px solid $primary;
}

.auction-details {
  .name {
    font-weight: bold;
    font-size: 2rem;
  }

  .keywords {
    font-size: 1.3rem;
    color: #bdbdbd;
  }
}

.bid {
  .highest-bid {
    font-size: 1rem;
  }
  .price {
    color: $positive;
    font-size: 1rem;
  }
}

.dot {
  height: 150px;
  width: 150px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}
</style>
