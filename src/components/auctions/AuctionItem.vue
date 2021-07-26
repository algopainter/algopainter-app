<template>
  <div v-if="loading === false">
    <div class="art-header flex q-pb-sm">
      <div class="users">
        <q-avatar
          v-for="(bid, index) in isHot.bids"
          :key="index"
          size="lg"
          round
        >
          <img
            v-if="changeAvatar(bid.bidder)"
            :src="bidderAvatar"
          >
          <!--
          <div v-if="stopFunction != true">
          </div>
          -->
          <q-tooltip
            class="bg-primary"
          >
            {{ bid.bidder.role }}{{ $t('dashboard.homePage.colon') }} {{ bid.bidder.name }}
          </q-tooltip>
        </q-avatar>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <ShareArtIcons :art="isHot._id" />
        <div class="col-12 col-md-1">
          <LikeAnimation
            :likes="isHot.item.likes"
            @favoriteClicked="favoriteClicked()"
          />
        </div>
      </div>
    </div>
    <q-img
      class="art-image"
      :src="previewImageUrl"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ isHot.item.title }}
      </div>
      <div>
        <div class="flex items-center q-col-gutter-sm">
          <!--
          <div class="price">
            <div>{{ $n(auction.art.price, 'currency') }}</div>
          </div>
          -->
          <div class="price">
            <div>{{ isHot.bids[0].tokenSymbol + ' ' + isHot.bids[0].amount }}</div>
          </div>
          <div>
            {{ $t('dashboard.auctions.numberOfBids', {
              numberOfBids: isHot.bids.length,
            }) }}
          </div>
        </div>
      </div>

      <div class="highest-bid">
        <div
          v-for="(bid, index) in isHot.bids"
          :key="index"
        >
          <div v-if="bid.type === 'highest'">
            <i18n-t keypath="dashboard.auctions.highestBid">
              <template #highestBid>
                <b class="text-primary">{{ `${bid.amount} ${bid.tokenSymbol}` }}</b>
              </template>
            </i18n-t>
          </div>
        </div>
      </div>

      <q-btn
        flat
        color="primary"
        :label="$t('common.placeABid')"
        icon-right="mdi-arrow-right"
        :to="`/auctions/${isHot._id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
import AlgoButton from 'components/common/Button.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import ShareArtIcons from 'src/components/common/ShareArtIcons.vue';

class Props {
  isHot = prop({
    type: Object as PropType<IAuctionItem2>,
    required: true,
  });
}

interface Ioptions {
  socialNetworks: string;
}

@Options({
  components: {
    AlgoButton,
    LikeAnimation,
    ShareArtIcons,
  },
  watch: {
    isAuctionFavorite: ['incrementCounter', 'postFavoriteAuction'],
  },
  emits: [
    'favoriteClicked',
  ],
})
export default class AuctionItem extends Vue.with(Props) {
  share(id: string, socialMedia: string) {
    const urlsShared: {[index: string]:string} = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=https://app.algopainter.art/paintings/${id}`,
      Twitter: `https://twitter.com/intent/tweet?url=https://app.algopainter.art/paintings/${id}&amp;text=teste&amp;hashtags=algoPainter,Algo%20Painter`,
      Telegram: `https://telegram.me/share/?url=https://app.algopainter.art/paintings/${id}%3F&title=Alogo%20painter%20I%20`,
      Email: 'mailto:[]?subject=AlgoPainter',
    };
    console.log(socialMedia);
    const linkElement = document.createElement('a');
    linkElement.href = (urlsShared[socialMedia]);
    window.open(linkElement.href, '_blank', 'width=550, height=555, top=100, left=190, scrollbars=no');
  }

  test: number = 2;
  loading: boolean = true;
  previewImageUrl: string = '';
  bidderAvatar: string = '';
  /* functionCounter: number = 0;
  stopFunction: boolean = false; */

  changeAvatar(bid: []/*, length: number */) {
    if (typeof (bid) !== 'undefined') {
      this.bidderAvatar = bid.avatar;
      return true;
    }
    /* this.functionCounter = this.functionCounter + 1;
    if (this.functionCounter > length) {
      this.stopFunction = true;
      this.functionCounter = 0;
    } */
    this.bidderAvatar = '';
    return false;
  }

  mounted() {
    setTimeout(this.showRun, 0);
  }

  showRun() {
    this.loading = false;
    this.previewImageUrl = this.isHot.item.previewImageUrl;
  }

  favoriteClicked() {
    this.$emit('favoriteClicked');
  }

  options: Ioptions = {
    socialNetworks: '',
  }

  socialNetworks = [
    {
      value: 0,
      label: 'Facebook',
      name: 'facebook',
    },
    {
      value: 0,
      label: 'Twitter',
      name: 'mdi-twitter',
    },
    {
      value: 0,
      label: 'Telegram',
      name: 'mdi-telegram',
    },
    {
      value: 0,
      label: 'Email',
      name: 'mdi-email',
    },
  ]

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
.btn-dropdown{
  color: #f4538d;
}
.link-sharer{
  text-decoration: none;
  color: black;
}
.btn-dropdown:before{
  box-shadow: none;
  border: none;
}
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

</style>
