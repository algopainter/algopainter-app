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

          <q-tooltip
            class="bg-primary"
          >
            {{ person.accountable }}{{ $t('dashboard.homePage.colon') }} {{ person.name }}
          </q-tooltip>
        </q-avatar>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <ShareArtIcons :art="auction.art" />
        <div class="col-12 col-md-1">
          <LikeAnimation
            @favoriteClicked="favoriteClicked()"
          />
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
        :to="`/auctions/${auction.id}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import ShareArtIcons from 'src/components/common/ShareArtIcons.vue';

class Props {
  auction = prop({
    type: Object as PropType<IAuctionItem>,
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
