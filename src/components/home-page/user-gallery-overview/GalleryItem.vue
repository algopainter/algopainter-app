<template>
  <div>
    <div
      class="art-header flex q-pb-sm"
    >
      <div
        v-for="(person, index) in art.users"
        :key="index"
        class="users"
      >
        <router-link :to="{name: 'customUrl', params: { customUrl: person.customProfile || person.account } }">
          <q-avatar
            size="lg"
            class="q-mr-xm"
            round
          >
            <img
              :src="person.avatar || '/images/do-utilizador (1).png'"
            >
            <q-tooltip
              class="bg-primary"
            >
              {{ person.role }}{{ $t('dashboard.homePage.colon') }} {{ person.name }}
            </q-tooltip>
          </q-avatar>
        </router-link>
      </div>
      <q-space />
      <ShareArtIcons
        :art="art.nft.previewImage"
        :_id="art._id"
      />
      <LikeAnimation
        :liked="wasLiked"
        :likes="likes || art.likes"
        @favoriteClicked="favoriteClicked"
      />
    </div>
    <q-img
      class="art-image"
      :src="art.nft.previewImage"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ $t('dashboard.homePage.symbol') }}{{ art.nft.index }} {{ art.title }}
      </div>
      <q-tooltip
        class="bg-primary"
      >
        {{ art.title }}
      </q-tooltip>
      <div class="item-actions row q-col-gutter-md">
        <div class="col-auto">
          <algoButton
            icon="visibility"
            class="q-my-md action"
            color="primary"
            :to="`/collections/${art._id}`"
          />
        </div>
        <div class="col">
          <algoButton
            class="q-my-md action full-width"
            color="primary"
            :label="$t('dashboard.homePage.sell')"
            @click="openAuctionModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IMyGallery } from 'src/models/IMyGallery';
import AlgoButton from '../../common/Button.vue';
import ShareArtIcons from '../../common/ShareArtIcons.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';

class Props {
  art = prop({
    type: Object as PropType<IMyGallery>,
    required: true,
  });

  user = prop({
    type: Boolean,
    required: false,
    default: false,
  });
}
@Options({
  components: {
    AlgoButton,
    ShareArtIcons,
    LikeAnimation,
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
    this.likes = this.art.likes;
  }

  loadData() {
    this.wasLiked =
      (this.art.likers as string[]).filter(
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

  favoriteClicked(wasLiked: boolean) {
    if (!this.likeClicked) {
      this.likeClicked = true;
      this.$emit('favoriteClicked');
      if (this.isConnected) {
        wasLiked ? void this.postFavoriteArt() : void this.deleteFavoriteArt();
      }
    }
  }

  postFavoriteArt() {
    this.collectionArtController
      .favoriteArt(this.art._id, this.account)
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
      .deleteFavoriteArt(this.art._id, this.account)
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

  openAuctionModal() {
    void this.$store.dispatch('auctions/openAuctionModal');
  }
}
</script>

<style lang="scss" scoped>

.cursor-pointer {
  cursor: pointer;
}

.teste {
  width: 100px;
  height: 100px;
  background-color: red;
}

.users {
  .q-avatar:not(:first-child) {
    margin-left: -8px;
  }
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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    width: 250px;
  }

  .price {
    display: flex;
    align-items: center;
    color: $positive;
    font-size: 1.4rem;
    font-weight: bold;

    img {
      display: block;
      height: 23px;
      padding-right: 6px;
    }
  }

  .bid-back {
    display: flex;
    align-items: center;
    color: $primary;
    font-size: 1rem;
    font-weight: bold;

    img {
      display: block;
      height: 20px;
      padding-right: 6px;
    }
  }

  .pirs {
    display: flex;
    font-size: 1rem;

    .label {
      color: $primary;
      padding-right: 6px;
    }

    img {
      display: block;
      height: 20px;
      padding-right: 6px;
    }
  }

  .sell-action {
    font-size: 1.1rem;
    font-weight: bold;
    color: $positive;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }

  .item-actions {
    .action {
      min-width: unset;
    }
  }
}
</style>
