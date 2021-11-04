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
      <div class="item-actions row q-col-gutter-md justify-center">
        <div class="row justify-center text-center">
          <algoButton
            icon="visibility"
            size="10px"
            class="q-my-md item-visibility"
            :class="[ btnName ? null : 'q-pl-auto' ]"
            color="primary"
            :to="`/collections/${art._id}`"
          />
        </div>
        <div
          v-if="btnName"
          class="col"
        >
          <algoButton
            v-if="btnName === 'dashboard.auctions.stackAlgop'"
            class="q-my-md action full-width"
            color="primary"
            :label="$t(btnName)"
            @click="openAuctionModal"
          />
          <div v-else-if="btnName === 'dashboard.homePage.goToAuction'">
            <algoButton
              v-if="auction && auctionEnded"
              class="q-my-md action full-width"
              color="primary"
              :label="endAuctionBtnLabel"
              :disable="loadingGoToAuctionId"
              @click="endAuction"
            />
            <algoButton
              v-else-if="auction && auctionEndedWithNoBids"
              class="q-my-md action full-width"
              color="primary"
              label="Get your NFT back"
              :disable="loadingGoToAuctionId"
              @click="cancelAuction"
            />
            <algoButton
              v-else
              class="q-my-md action full-width"
              color="primary"
              :label="$t(btnName)"
              :to="`/auctions/${goToAuctionId}`"
              :disable="loadingGoToAuctionId"
            />
          </div>
          <algoButton
            v-else
            class="q-my-md action full-width"
            color="primary"
            :label="$t(btnName)"
            :to="`/sell-your-art/${art._id}`"
          />
        </div>
      </div>
    </div>
    <q-dialog
      v-model="displayEndAuctionStatus"
      persistent
    >
      <end-auction-status-card
        :end-auction-status="endAuctionStatus"
        @request-close="onCloseEndAuctionDialog"
      />
    </q-dialog>
    <q-dialog
      v-model="displayCancelAuctionStatus"
      persistent
    >
      <return-nft
        :delete-auction-status="deleteAuctionStatus"
        @request-close="onCloseCancelAuctionDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { mapGetters } from 'vuex';
import { Vue, Options, prop } from 'vue-class-component';

import { api } from 'src/boot/axios';
import { IMyGallery } from 'src/models/IMyGallery';
import AlgoButton from '../../common/Button.vue';
import ShareArtIcons from '../../common/ShareArtIcons.vue';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import EndAuctionStatusCard from 'components/auctions/auction/EndAuctionStatusCard.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';
import { IAuctionItem } from 'src/models/IAuctionItem';
import moment from 'moment';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterAuctionSystemProxy, {
  EndAuctionStatus,
} from 'src/eth/AlgoPainterAuctionSystemProxy';
import { now } from 'src/helpers/timer';
import DeleteAuctionStatusCard from 'components/auctions/auction/DeleteAuctionStatusCard.vue';
import ReturnNft from 'components/auctions/auction/ReturnNft.vue';

enum DeletingAuctionStatus {
  DeleteAuctionAwaitingInput,
  DeleteAuctionAwaitingConfirmation,
  DeleteAuctionError,
  AuctionDeleted,
}

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

  btnName = prop({
    type: String,
    required: false,
  });
}
@Options({
  components: {
    AlgoButton,
    ShareArtIcons,
    LikeAnimation,
    EndAuctionStatusCard,
    DeleteAuctionStatusCard,
    ReturnNft
  },
  computed: {
    ...mapGetters(
      'user', {
        networkInfo: 'networkInfo',
        account: 'account',
        isConnected: 'isConnected',
      }),
  },
})
export default class GalleryItem extends Vue.with(Props) {
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  auctionSystem!: AlgoPainterAuctionSystemProxy;
  deleteAuctionStatus: DeletingAuctionStatus | null = null;
  endAuctionStatus: EndAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;
  displayEndAuctionStatus: boolean = false;
  displayCancelAuctionStatus: boolean = false;

  likeClicked: boolean = false;
  wasLiked: boolean = false;
  likes!: number;
  goToAuctionId: string | null = null;
  auction!: IAuctionItem;
  loadingGoToAuctionId: boolean = true;

  collectionArtController: CollectionArtController =
    new CollectionArtController();

  mounted() {
    if (this.isConnected) {
      void this.loadData();
    }
    this.likes = this.art.likes;
    void this.loadAuctionData();
  }

  get auctionEnded() {
    if (!this.auction) {
      return false;
    }

    return this.auction.highestBid &&
      moment(this.auction.expirationDt).isBefore(moment());
  }

  get auctionEndedWithNoBids() {
    if (!this.auction) {
      return false;
    }

    return this.auction.bids.length === 0 &&
      moment(this.auction.expirationDt).isBefore(moment());
  }

  get coinDetails() {
    if (!this.auction) {
      return null;
    }

    const { minimumBid } = this.auction;

    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === minimumBid.tokenPriceAddress;
    });

    return coin;
  }

  get endAuctionBtnLabel() {
    if (!this.auction || !this.coinDetails) {
      return '';
    }

    const { highestBid } = this.auction;

    const { label: coin, decimalPlaces } = this.coinDetails;

    const value = blockchainToCurrency(
      highestBid ? highestBid.amount : 0,
      decimalPlaces,
    );

    const amount = this.$n(value, 'decimal', {
      maximumFractionDigits: decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return this.$t('dashboard.auctionPage.claimBtn', { amount, coin });
  }

  async loadAuctionData() {
    this.loadingGoToAuctionId = true;

    const response = await api
      .get<IAuctionItem[]>(`auctions?item._id=${this.art._id}`);

    const auction = response.data.pop();

    if (!auction) {
      return;
    }

    this.auction = auction;
    this.goToAuctionId = this.auction._id;
    this.loadingGoToAuctionId = false;
  }

  get now() {
    return now.value;
  }

  loadData() {
    this.wasLiked =
      (this.art.likers as string[]).filter(
        (liker) => liker.toLowerCase() === this.account.toLowerCase(),
      ).length !== 0;
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

  async endAuction() {
    if (!this.auction) {
      return;
    }

    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    this.displayEndAuctionStatus = true;
    this.endAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;

    await this.auctionSystem.endAuction(
      this.auction.index,
      this.account,
    ).on('error', () => {
      this.endAuctionStatus = EndAuctionStatus.EndAuctionError;
    }).on('transactionHash', () => {
      this.endAuctionStatus =
        EndAuctionStatus.EndAuctionAwaitingConfirmation;
    });

    this.endAuctionStatus = EndAuctionStatus.AuctionEnded;
  }

  async cancelAuction() {
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    this.displayCancelAuctionStatus = true;
    this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionAwaitingInput;

    await this.auctionSystem.cancelAuction(this.auction.index, this.account).on('transactionHash', () => {
      this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionAwaitingConfirmation;
    }).on('error', () => {
      this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionError;
    });

    this.deleteAuctionStatus = DeletingAuctionStatus.AuctionDeleted;
  }

  onCloseEndAuctionDialog() {
    this.displayEndAuctionStatus = false;
  }

  onCloseCancelAuctionDialog() {
    this.displayCancelAuctionStatus = false;

    if (this.deleteAuctionStatus === DeletingAuctionStatus.AuctionDeleted) {
      this.$q.notify({
        type: 'positive',
        message: this.$t('dashboard.auctionPage.cancelAuctionStatuses.deleteAuctionDeleted'),
      });
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
    .item-visibility{
      align-items: center;
      min-width: 30px;
      text-align: center;
      justify-content: center;
    }
    i {
      margin-right: 0px !important;
    }
  }
}
</style>
