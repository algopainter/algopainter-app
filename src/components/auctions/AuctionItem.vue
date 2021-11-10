<template>
  <div v-if="loading === false">
    <div class="art-header flex q-pb-sm">
      <div class="users flex q-pb-sm">
        <div
          v-for="(bid, index) in isHot.users"
          :key="index"
        >
          <router-link :to="{name: 'customUrl', params: { customUrl: bid.customProfile || bid.account } }">
            <q-avatar
              v-if="changeAvatar(bid.avatar)"
              size="lg"
              round
            >
              <img
                :src="bid.avatar || '/placeholder-images/do-utilizador.png'"
              >
              <q-tooltip
                class="bg-primary"
              >
                {{ bid.role }}{{ $t('dashboard.homePage.colon') }} {{ bid.name }}
              </q-tooltip>
            </q-avatar>
          </router-link>
        </div>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <share-auction
          :art="previewImage"
          :_id="isHot._id"
        />
        <!--
        <div class="col-12 col-md-1 flex">
          <LikeAnimation
            :likes="likes || isHot.likes"
            :liked="wasLiked"
            @favoriteClicked="favoriteClicked"
          />
        </div>
        -->
      </div>
    </div>
    <q-img
      class="art-image"
      :src="isHot.item.previewImage"
    >
      <div class="row justify-end pirs-bidback">
        <div
          class="bidBack text-white column justify-center content-center q-mb-xl"
        >
          <div class="row justify-center items-center content-center">
            {{ auctionBidbackRate + "%" }}
          </div>
          <div class="row justify-center items-center content-center">
            {{ $t('dashboard.gallery.bidBackTab.bidBack') }}
          </div>
        </div>
        <div
          class="pirs text-white column justify-center content-center q-mb-xl"
        >
          <div class="row justify-center items-center content-center">
            {{ imagePirsRate + "%" }}
          </div>
          <div class="row justify-center items-center content-center">
            {{ $t('dashboard.gallery.pirsTab.pirs') }}
          </div>
        </div>
      </div>
    </q-img>
    <div class="details flex q-pa-sm">
      <div>
        <div
          class="name"
        >
          {{ $t('dashboard.homePage.symbol') }}{{ isHot.item.index }} {{ isHot.item.title }}
        </div>
        <q-tooltip
          class="bg-primary"
        >
          {{ isHot.item.title }}
        </q-tooltip>
      </div>

      <div
        v-if="lastValueBid < 0"
        class="highest-bid"
      >
        <i18n-t keypath="dashboard.auctions.minimumBid">
          <template #highestBid>
            <div
              class="flex items-center q-col-gutter-sm q-ml-xs"
            >
              <div
                class="price"
              >
                <div class="row">
                  <div class="ellipsis q-mr-xs">
                    {{ bidValue(isHot.minimumBid.amount) }}
                  </div>
                  <div>
                    {{ isHot.minimumBid.tokenSymbol }}
                  </div>
                  <q-tooltip
                    anchor="top middle"
                    self="center middle"
                    class="bg-primary"
                  >
                    {{ bidValue(isHot.minimumBid.amount) + ' ' + isHot.minimumBid.tokenSymbol }}
                  </q-tooltip>
                </div>
              </div>
            </div>
          </template>
        </i18n-t>
      </div>
      <div
        v-else
        class="highest-bid"
      >
        <i18n-t keypath="dashboard.auctions.highestBid">
          <template #highestBid>
            <div
              class="flex items-center q-col-gutter-sm q-ml-xs"
            >
              <div
                class="price"
              >
                <div class="row">
                  <div class="ellipsis q-mr-xs">
                    {{ bidValue(isHot.highestBid.amount) }}
                  </div>
                  <div>
                    {{ isHot.highestBid.tokenSymbol }}
                  </div>
                  <q-tooltip
                    anchor="top middle"
                    self="center middle"
                    class="bg-primary"
                  >
                    {{ bidValue(isHot.highestBid.amount) + ' ' + isHot.highestBid.tokenSymbol }}
                  </q-tooltip>
                </div>
              </div>
            </div>
          </template>
        </i18n-t>
      </div>
      <div class="flex">
        <algo-button
          class="btn-place-a-bid"
          color="primary"
          :label="$t('common.placeABid')"
          :to="`/auctions/${isHot._id}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import AlgoPainterBidBackPirsProxy from 'src/eth/AlgoPainterBidBackPirsProxy';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import ShareAuction from 'src/components/common/ShareAuction.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
class Props {
  isHot = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
}
@Options({
  components: {
    AlgoButton,
    LikeAnimation,
    ShareAuction,
  },
  watch: {
    account: ['loadData'],
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
  },
})
export default class AuctionItem extends Vue.with(Props) {
  bidBackPirsSystem!: AlgoPainterBidBackPirsProxy;
  networkInfo!: NetworkInfo;
  auctionBidbackRate: number = 0;
   imagePirsRate: number = 0;
  collectionArtController: CollectionArtController = new CollectionArtController();
  wasLiked: boolean = false;
  likes!: number;
  loading: boolean = true;
  previewImage: string = '';
  bidderTrue: string = '';
  lastBidLength: number = 0;
  lastValueBid: number = 0;
  valueCoin!: string;
  // usersOwner: unknown;
  // isHotUnkown: unknown;
  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/account'];
  }

  /* functionCounter: number = 0;
  stopFunction: boolean = false; */
  changeAvatar(bid: unknown) {
    if (typeof (bid) !== 'undefined') {
      return 'src/assets/do-utilizador.png';
    } else {
      return this.isHot.users;
    }
  }

  created() {
    this.bidBackPirsSystem = new AlgoPainterBidBackPirsProxy(this.networkInfo);
  }

  mounted() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    setTimeout(this.showRun, 0);
    void this.getBidbackPercentage();
    void this.getPirsPercentage();
    void this.loadData();
    void this.lastBid();
  }

  async getBidbackPercentage() {
    try {
      this.auctionBidbackRate = await this.bidBackPirsSystem.getBidbackRate(this.isHot.index);
    } catch (error) {
      console.log('Error - getBidbackPercentage - GallerySelect');
    }
  }

  async getPirsPercentage() {
    try {
      this.imagePirsRate = await this.bidBackPirsSystem.getInvestorPirsRate(this.isHot.index);
    } catch (error) {
      console.log('Error - getPirsPercentage - PirsItem');
    }
  }

  loadData() {
    this.wasLiked =
      this.isHot.likers.filter((liker) => liker === this.account)
        .length !== 0;
    this.likes = this.isHot.likes;
  }

  showRun() {
    this.loading = false;
    this.previewImage = this.isHot.item.previewImage;
  }

  favoriteClicked(wasLiked: boolean) {
    this.$emit('favoriteClicked');
    if (this.isConnected) {
      wasLiked ? void this.postFavoriteArt() : void this.deleteFavoriteArt();
    }
  }

  postFavoriteArt() {
    this.collectionArtController
      .favoriteArt(this.isHot.item._id, this.account)
      .then(
        (result) => {
          if (result.isFailure) {
            this.like(true);
          }
        },
        (error) => {
          // tratar erro
          console.log('"like" post error: ', error);
        },
      );
    this.like();
  }

  deleteFavoriteArt() {
    this.collectionArtController
      .deleteFavoriteArt(this.isHot.item._id, this.account)
      .then(
        (result) => {
          if (result.isFailure) {
            this.like();
          }
        },
        (error) => {
          // tratar erro
          console.log('"like" delete error: ', error);
        },
      );
    this.like(true);
  }

  like(undo: boolean = false) {
    if (undo) {
      this.wasLiked = false;
      this.likes--;
    } else {
      this.wasLiked = true;
      this.likes++;
    }
  }

  lastBid() {
    const bidLength = this.isHot.bids.length;
    this.lastValueBid = bidLength - 1;
  }

  get coinDetails() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const coin = auctionCoins.find((coin) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return coin.tokenAddress.toLowerCase() === this.isHot.minimumBid.tokenPriceAddress;
    });
    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }
    return coin;
  }

  bidValue(bids: number) {
    const amount = blockchainToCurrency(
      bids,
      this.coinDetails.decimalPlaces,
    );
    return this.$n(amount, 'decimal', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  // get reductionBidValue() {
  //   const coinReduction = this.valueCoin as unknown as number;
  //   return UserUtils.formatAccountBalance(coinReduction, 2);
  // }
  // showValue(bids: number) {
  //   this.bidValue(bids);
  //   return this.reductionBidValue;
  // }
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
.bidBack{
  text-align: unset;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: $primary;
  font-size: 9px;
  margin-left: 9px ;
}
.pirs{
  text-align: unset;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: $primary;
  font-size: 9px;
  margin-left: 1px;
  margin-right: -10px
}
.pirs-bidback{
  margin-top: -13px;
  margin-right: 0px;
  background: none;
  width: 100%;
}
.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
.name {
    font-weight: bold;
    font-size: 1.4rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    width: 250px;
}
  .price {
    color: $positive;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .highest-bid {
    font-size: 1.1rem;
    display: flex;
    b {
      margin-left: 5px;
    }
  }
  .btn-place-a-bid{
    width: 300px;
  }
  .ellipsis{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    max-width: 120px;
  }
}
</style>
