<template>
  <div class="container">
    <div class="art-header flex q-pb-sm">
      <div
        v-for="person in galleryItem.art.importantPeople"
        :key="person.id"
        class="users"
      >
        <router-link
          :to="{name: 'customUrl', params: { customUrl: person.customProfile || person.account} }"
        >
          <q-avatar
            size="lg"
            round
          >
            <img
              :src="person.picture || '/images/do-utilizador (1).png'"
            >
            <q-tooltip class="bg-primary">
              {{ person.accountable }}{{ $t('dashboard.homePage.colon') }}
              {{ person.name }}
            </q-tooltip>
          </q-avatar>
        </router-link>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <ShareArtIcons
          :art="galleryItem.art.source"
          :_id="galleryItem.id"
        />
        <div class="col-12 col-md-1">
          <div class="col-12 col-md-1">
            <LikeAnimation
              :liked="wasLiked"
              :likes="likes || galleryItem.art.likes"
              @favoriteClicked="favoriteClicked"
            />
          </div>
        </div>
      </div>
    </div>
    <q-img
      class="art-image"
      :src="galleryItem.art.source"
    />
    <div class="details q-pa-sm">
      <div class="name limit-text">
        {{ $t('dashboard.homePage.symbol') }}{{ galleryItem.index }} {{ galleryItem.art.name }}
        <q-tooltip
          class="bg-primary"
        >
          {{ galleryItem.art.name }}
        </q-tooltip>
      </div>
      <div v-if="galleryItem.description.trim() === ''">
        <p class="white-text" />
      </div>
      <div
        v-else
        class="limit-text"
      >
        {{ galleryItem.description }}
        <q-tooltip
          anchor="bottom middle"
          max-width="200px"
          class="bg-primary"
        >
          {{ galleryItem.description }}
        </q-tooltip>
      </div>
      <div class="row justify-center">
        <algoButton
          icon="visibility"
          class="full-width q-my-md"
          color="primary"
          :label="$t('dashboard.auctionPage.btnView')"
          :to="`/collections/${galleryItem.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IGallery } from 'src/models/IGallery';
import AlgoButton from 'components/common/Button.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import ShareArtIcons from 'src/components/common/ShareArtIcons.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';

class Props {
  galleryItem = prop({
    type: Object as PropType<IGallery>,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
    LikeAnimation,
    ShareArtIcons,
  },
  computed: {
    account: '',
    isConnected: false,
  },
  watch: {
    account: ['loadData'],
  },
})
export default class GalleryItem extends Vue.with(Props) {
  // like feature variables
  likeClicked: boolean = false;
  wasLiked: boolean = false;
  likes!: number;

  collectionArtController: CollectionArtController =
  new CollectionArtController();

  mounted() {
    if (this.isConnected) {
      void this.loadData();
    }
    this.likes = this.galleryItem.art.likes as number;
  }

  loadData() {
    this.wasLiked =
      (this.galleryItem.art.likers as string[]).filter(
        (liker) => liker.toLowerCase() === this.account,
      ).length !== 0;
  }

  get account() {
    if (this.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return this.$store.getters['user/account'].toLowerCase();
    }
    return null;
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  /*
  get openConnectYourWalletModal() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/GET_OPEN_CONNECT_YOUR_WALLET_MODAL'];
  }
  */

  favoriteClicked(wasLiked: boolean) {
    if (!this.likeClicked) {
      this.likeClicked = true;
      if (this.isConnected) {
        wasLiked ? void this.postFavoriteArt() : void this.deleteFavoriteArt();
      } else {
        void this.$store.dispatch('user/openConnectYourWalletModal');
        this.likeClicked = false;
        /*
        const checkIfModalIsStillOpen = setInterval(() => {
          if (!this.openConnectYourWalletModal) {
            wasLiked ? void this.postFavoriteArt() : void this.deleteFavoriteArt();
            clearInterval(checkIfModalIsStillOpen);
          }
        }, 3000) as unknown as number;
        */
      }
    }
  }

  postFavoriteArt() {
    this.collectionArtController
      .favoriteArt(this.galleryItem.art.id, this.account)
      .then(
        (result) => {
          if (result.isFailure) {
            this.like(true);
            this.likeClicked = false;
          }
          this.likeClicked = false;
        },
        (error) => {
          console.log('"like" post error: ', error);
          this.likeClicked = false;
        },
      );
    this.like();
  }

  deleteFavoriteArt() {
    this.collectionArtController
      .deleteFavoriteArt(this.galleryItem.art.id, this.account)
      .then(
        (result) => {
          if (result.isFailure) {
            this.like();
            this.likeClicked = false;
          }
          this.likeClicked = false;
        },
        (error) => {
          console.log('"like" delete error: ', error);
          this.likeClicked = false;
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
.container {
  padding: 0 1rem 0 0;
}
.white-text{
  height:4px;
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

  .white-text{
    height:4px;
  }

  .limit-text {
    word-break: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 280px;
  }

  .limit-description{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 280px;
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
