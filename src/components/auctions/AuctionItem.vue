<template>
  <div>
    <div class="art-header flex q-pb-sm">
      <div class="users">
        <q-avatar
          v-for="person in auction.art.importantPeople"
          :key="person.id"
          size="lg"
          round
        >
          <img :src="person.picture">
          <q-tooltip>{{ person.name }}</q-tooltip>
        </q-avatar>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <div>
          <q-icon
            color="primary"
            size="sm"
            name="mdi-dots-horizontal"
          />
        </div>
        <div class="col-12 col-md-1">
          <div class="col-12 col-md-1">
            <div class="icons text-center flex justify-center">
              <div class="favorite">
                <div>
                  <q-icon
                    color="primary"
                    size="1.7rem"
                    :name="
                      isAuctionFavorite ? 'mdi-heart' : 'mdi-heart-outline'
                    "
                    :class="{
                      press: isAuctionFavorite,
                      shake: isAuctionFavorite,
                    }"
                    @click="favoriteAuction"
                  />
                  <div class="text-primary">
                    {{ favoriteCounter }}
                  </div>
                  <span
                    :class="{ press: isAuctionFavorite } "
                  >{{ $t('dashboard.auctionPage.liked') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-img
      class="art-image"
      src="../../assets/placeholder-images/painting.jpg"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ auction.art.name }}
      </div>
      <div>
        <div class="flex items-center q-col-gutter-sm">
          <div class="price">
            <div>{{ $n(auction.art.price, 'currency') }}</div>
          </div>
          <div>
            {{ $t('dashboard.auctions.numberOfBids', {
              numberOfBids: auction.numberOfBids,
            }) }}
          </div>
        </div>
      </div>
      <div class="highest-bid">
        <i18n-t keypath="dashboard.auctions.highestBid">
          <template #highestBid>
            <b class="text-primary">{{ `${auction.highestBid}WETH` }}</b>
          </template>
        </i18n-t>
      </div>
      <q-btn
        flat
        color="primary"
        :label="$t('common.placeABid')"
        icon-right="mdi-arrow-right"
        to="/auctions/123"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';

class Props {
  auction = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
  },
  watch: {
    isAuctionFavorite: ['incrementCounter', 'postFavoriteAuction'],
  },
})
export default class AuctionItem extends Vue.with(Props) {
  isAuctionFavorite: boolean = false;

  favoriteAuction() {
    this.isAuctionFavorite = !this.isAuctionFavorite;
  }

  incrementCounter() {
    this.isAuctionFavorite ? this.favoriteCounter++ : this.favoriteCounter--;
  }

  postFavoriteAuction() {
  // post http request
    return true;
  }

  // FAKE DATA
  favoriteCounter: number = parseInt(
    (Math.random() * 100).toString(),
  );
}
</script>

<style lang="scss" scoped>
.users {
  .q-avatar:not(:first-child) {
    margin-left: -8px;
  }
}

.actions {
  cursor: pointer;
}

.art-image {
  border-radius: 5px;
  width: 300px;
  height: 300px;
}

.details {
  .name {
    font-weight: bold;
    font-size: 1.4rem;
  }

  .price {
    display: flex;
    align-items: center;
    color: $positive;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .highest-bid {
    font-size: 1.1rem;
  }
}

.favorite {
div {
  height: 40px;
  margin: 0 auto;
  position: relative;
}
@keyframes fade {
  0% {
    color: rgba(255, 255, 255, 0);
  }
  50% {
    color: $primary;
  }
  100% {
    color: rgba(255, 255, 255, 0);
  }
}
span {
  position: absolute;
  bottom: 70px;
  left: 0;
  right: 0;
  visibility: hidden;
  transition: 0.6s;
  z-index: -2;
  font-size: 3px;
  color: transparent;
  font-weight: 400;
}
span.press {
  bottom: 40px;
  left: -7px;
  font-size: 14px;
  visibility: visible;
  animation: fade 1s;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  40%,
  60% {
    transform: translate3d(0, -5px, 0);
  }
}
}
</style>
