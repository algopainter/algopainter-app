<template>
  <div v-if="loading === false">
    <div class="art-header flex q-pb-sm">
      <div class="users flex q-pb-sm">
        <div
          v-for="(bid, index) in isHot.bids"
          :key="index"
        >
          <router-link :to="{path: 'user-gallery', query: { customProfile: bid.bidder.account }}">
            <q-avatar
              v-if="changeAvatar(bid.bidder)"
              size="lg"
              round
            >
              <img
                :src="bid.bidder.avatar"
              >
              <q-tooltip
                class="bg-primary"
              >
                {{ bid.bidder.role }}{{ $t('dashboard.homePage.colon') }} {{ bid.bidder.name }}
              </q-tooltip>
            </q-avatar>
          </router-link>
        </div>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <ShareArtIcons
          :art="previewImageUrl"
          :is-hot="isHot._id"
        />
        <div class="col-12 col-md-1 flex">
          <LikeAnimation
            :likes="likes || isHot.item.likes"
            :liked="wasLiked"
            @favoriteClicked="favoriteClicked"
          />
        </div>
      </div>
    </div>
    <q-img
      class="art-image"
      :src="previewImageUrl"
    />
    <div class="details flex q-pa-sm">
      <div>
        <div
          class="name"
        >
          {{ isHot.item.title }}
        </div>
        <q-tooltip
          class="bg-primary"
        >
          {{ isHot.item.title }}
        </q-tooltip>
      </div>
      <div>
        <div class="flex items-center q-col-gutter-sm">
          <div class="price">
            <div>{{ isHot.bids[0].tokenSymbol + ' ' + isHot.bids[0].amount }}</div>
          </div>
        </div>
      </div>

      <div class="highest-bid">
        <i18n-t keypath="dashboard.auctions.highestBid">
          <template #highestBid>
            <b class="text-primary">{{ `${isHot.highestBid.amount} ${isHot.highestBid.tokenSymbol}` }}</b>
          </template>
        </i18n-t>
      </div>
      <div class="flex">
        <q-btn
          flat
          color="primary"
          :label="$t('common.placeABid')"
          icon-right="mdi-arrow-right"
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
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import ShareArtIcons from 'src/components/common/ShareArtIcons.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';

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
    ShareArtIcons,
  },
  watch: {
    account: ['loadData'],
  },
})
export default class AuctionItem extends Vue.with(Props) {
  collectionArtController: CollectionArtController = new CollectionArtController();

  wasLiked: boolean = false;

  likes!: number;

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/account'];
  }

  loading: boolean = true;
  previewImageUrl: string = '';
  /* functionCounter: number = 0;
  stopFunction: boolean = false; */

  changeAvatar(bid: unknown) {
    if (typeof (bid) !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return true;
    }
    return false;
  }

  mounted() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    setTimeout(this.showRun, 0);
    void this.loadData();
  }

  loadData() {
    this.wasLiked =
      this.isHot.item.likers.filter((liker) => liker === this.account)
        .length !== 0;
    this.likes = this.isHot.item.likes;
  }

  showRun() {
    this.loading = false;
    this.previewImageUrl = this.isHot.item.previewImageUrl;
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
}

</style>
