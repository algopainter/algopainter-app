<template>
  <div v-if="loading === false">
    <div class="row justify-between items-center">
      <div class="col-xs-12 col-sm-6 col-md-6 row justify-between items-center container-text-share">
        <div>
          <p class="text-bold text-h5 text-img">
            {{ $t('dashboard.homePage.symbol') }}{{ image.nft.sequentialNumber ? image.nft.sequentialNumber : image.nft.index }} {{ image.title }}
          </p>
          <q-tooltip
            class="bg-primary"
          >
            {{ image.title }}
          </q-tooltip>
        </div>

        <div class="flex align-center">
          <LikeAnimation
            :liked="wasLiked"
            :likes="likes"
            @favoriteClicked="favoriteClicked"
          />
          <ShareArtIcons
            :art="image.nft.image"
            :_id="image._id"
          />
        </div>
      </div>
      <div class=" col-xs-12 col-sm-6 col-md-6 column items-end">
        <algo-button
          :label="$t('dashboard.gallery.newPainting')"
          class="q-ma-md btn-newPainting"
          color="primary"
          @click="$router.push('/create-collectible')"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6">
        <div
          class="row justify-center"
        >
          <img
            v-show="!isBackgroundUpdating && isImgLoaded"
            ref="previewImg"
            class="img"
            :src="imageUrl"
          />
          <q-spinner
            v-if="!isImgLoaded"
            size="50px"
            color="primary"
          />
        </div>
        <div class="text-download">
          <a
            target="_blank"
            :href="image.nft.rawImage"
            class="text-download"
          >
            {{ $t('dashboard.viewArt.download') }}
          </a>
          <q-select
            v-if="image.collectionName === 'Gwei'"
            v-model="chooseBackground"
            :options="backgroundImage"
            :label="$t('dashboard.viewArt.chooseBackground')"
            color="primary"
            dense
            @update:model-value="changeBackground(chooseBackground.value)"
          />
        </div>
        <algo-button
          color="primary"
          class="q-ma-xs btn-btnCreatepainter"
          :label="$t('dashboard.viewArt.btnCreatepainter')"
          @click="$router.push('/create-collectible')"
        />
      </div>
      <div class="col-xs-12 col-sm-5 col-md-5 details">
        <div>
          <div class="col">
            <p class="text-bold text-h5 q-mb-sm">
              {{ $t('dashboard.viewArt.details') }}
            </p>
            <div v-if="image.collectionName !== 'PersonalItem'">
              <span class="text-bold text-primary text-h6">
                {{ $t('dashboard.viewArt.algoPainter') }}
              </span>
              <p>{{ image.collectionName }} </p>
            </div>

            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.owner') }}
            </span>
            <p v-if="imageOwner.name === imageOwner.account">
              {{ formatAccount() }}
            </p>
            <p v-else>
              {{ imageOwner.name }}
              <q-tooltip
                v-if="imageOwner.name !== imageOwner.account "
                anchor="bottom middle"
                self="top middle"
                class="bg-primary"
                :offset="[0, 0]"
                :hide-delay="950"
              >
                {{ formatAccount() }}
              </q-tooltip>
            </p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.description') }}
            </span>
            <p
              class="text-description"
            >
              {{ image.description }}
            </p>
            <div v-if="image.collectionName === 'Gwei'">
              <p class="text-bold text-primary text-h6">
                {{ $t('dashboard.viewArt.parameters') }}
              </p>
              <span>{{ $t('dashboard.viewArt.text') }}</span>
              <span class="text-bold text-description">
                {{ image.nft.parameters.text }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.randomColor') }}</span>
              <span class="text-bold">
                {{ image.nft.parameters.useRandom === 'true' ? $t('dashboard.viewArt.yes') : $t('dashboard.viewArt.no') }}
              </span><br>
              <div v-if="image.nft.parameters.useRandom === 'true'">
                <span>{{ $t('dashboard.viewArt.probability') }}</span>
                <span class="text-bold">
                  {{ parsedProbability() }}%
                </span><br>
              </div>
              <span>{{ $t('dashboard.viewArt.inspiration') }}</span>
              <span class="text-bold">
                {{ parsedInspiration() }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.exhibition') }}</span>
              <span class="text-bold">
                {{ parsedTechnique() }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.technique') }}</span>
              <span class="text-bold">
                {{ parsedExhibition() }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.created') }}</span>
              <span class="text-bold">
                {{ image.creator }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.mint') }}</span>
              <span v-if="typeof (image.nft.parameters.amount) === 'number'" class="text-bold">
                {{ image.nft.parameters.amount }} {{ $t('dashboard.viewArt.algop') }}
              </span>
              <span v-else class="text-bold">
                {{ image.nft.parameters.amount }} {{ $t('dashboard.viewArt.algop') }}
              </span><br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <ViewArtSkeleton />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import ShareArtIcons from 'components/common/ShareArtIcons.vue';
import { IImage } from 'src/models/IImage';
import ViewArtSkeleton from './ViewArtSkeleton.vue';
import { api } from 'src/boot/axios';
import LikeAnimation from 'components/auctions/auction/LikeAnimation.vue';
import CollectionArtController from 'src/controllers/collectionArt/CollectionArtController';
import UserUtils from 'src/helpers/user';
import { IImageUser } from 'src/models/IImageUser';
import { IProfile } from 'src/models/IProfile';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { PaintGwei } from 'src/services/painting.js';

@Options({
  components: { AlgoButton, ShareArtIcons, LikeAnimation, ViewArtSkeleton },
  computed: {
    account: '',
    isConnected: false,
  },
  watch: {
    account: ['loadData'],
  },
})

export default class ViewArt extends Vue {
  loading: boolean = true;
  options: string = 'None';
  chooseBackground: string = '';
  isBackgroundUpdating: boolean = false;
  isImgLoaded: boolean = false;
  imageUrl: string = '';
  likeClicked: boolean = false;
  gwei: any;

  declare $refs: {
    previewImg: any;
  };

  mounted() {
    this.getDetailsData().catch(console.error);
    this.gwei = new PaintGwei();
  }

  parsedProbability() {
    const prob = parseFloat(String(this.image.nft.parameters.probability));
    return prob * 100;
  }

  parsedInspiration() {
    switch (this.image.nft.parameters.inspiration) {
      case '0':
        return 'Random';
      case '1':
        return 'Calm';
      case '2':
        return 'Colorful blocks';
      case '3':
        return 'Colorful paths';
      case '4':
        return 'Hot flows';
      case '5':
        return 'Galaxy';
      case '6':
        return 'Madness';
    }
  }

  parsedExhibition() {
    switch (this.image.nft.parameters.overlay) {
      case '1':
        return 'Splatters and Drips';
      case '2':
        return 'Dripping Paint';
      case '3':
        return 'Acrylic';
      case '4':
        return 'Freedom';
      case '5':
        return 'Heavy Brush';
      default:
        return 'Regular';
    }
  }

  parsedTechnique() {
    switch (this.image.nft.parameters.place) {
      case '0':
        return 'None';
      case '1':
        return 'Wall';
      case '2':
        return 'Big Wall';
      case '3':
        return 'Bedroom';
      case '4':
        return 'High-Tech Gallery';
      case '5':
        return 'Open Gallery';
      case '6':
        return 'Room';
      case '7':
        return 'PsyVerse';
      default:
        return 'None';
    }
  }

  formatHighestBidAmount() {
    const bidBackAmount = blockchainToCurrency(
      Number(this.image.nft.parameters.amount),
      this.coinDetails.decimalPlaces);
    return this.$n(bidBackAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return (
        coin.tokenAddress.toLowerCase() ===
        process.env.VUE_APP_ALGOP_TOKEN_ADDRESS
      );
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  checkIfImgIsLoaded() {
    const interval = setInterval(() => {
      this.isImgLoaded = this.$refs.previewImg.complete;

      if (this.isImgLoaded) {
        clearInterval(interval);
      }
    }, 1000);
  }

  async changeBackground(value: string) {
    this.isBackgroundUpdating = true;
    this.isImgLoaded = false;

    const parameters: Record<string, unknown> = this.image.nft.parameters;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.gwei.generate({
      finalWidth: 2422,
      finalHeight: 2422,
      inspiration: parameters.inspiration,
      text: parameters.text,
      useRandom: parameters.useRandom,
      probability: parameters.probability,
      useRandomOpacity: false,
      wallType: value.toString(),
      overlay: parameters.overlay,
      overlayOpacity: parameters.overlayOpacity
    })
      .then((img: string) => {
        this.checkIfImgIsLoaded();
        this.imageUrl = img;
      })

    this.isBackgroundUpdating = false;
  }

  collectionArtController: CollectionArtController = new CollectionArtController();

  wasLiked: boolean = false;

  likes!: number;

  imageOwner!: IImageUser;

  get account() {
    return this.$store.state.user.account as string;
  }

  async getDetailsData() {
    try {
      this.loading = true;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const data = await api.get(`images/${this.$route.params.id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.image = data.data as IImage;
      this.likes = this.image.likes;
      this.imageOwner = UserUtils.getUsersByRole(this.image.users as IImageUser[], 'owner')[0];
      this.loadWasLiked();
      this.imageUrl = this.image.nft.image;
      this.checkIfImgIsLoaded();
      this.loading = false;
    } catch (e) {
      console.log('e', e);
    }
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  favoriteClicked(wasLiked: boolean) {
    if (!this.likeClicked) {
      this.likeClicked = true;
      if (this.isConnected) {
        wasLiked ? this.postFavoriteArt() : this.deleteFavoriteArt();
      } else {
        this.$store.dispatch('user/openConnectYourWalletModal').catch(console.error);
        this.likeClicked = false;
      }
    }
  }

  loadWasLiked() {
    this.wasLiked =
      (this.image.likers || []).filter(
        (liker) => liker === this.account,
      ).length !== 0;
  }

  postFavoriteArt() {
    this.collectionArtController
      .favoriteArt(this.image._id, this.account)
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
      .deleteFavoriteArt(this.image._id, this.account)
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

  formatAccount() {
    return UserUtils.formatedAccount(this.imageOwner.account);
  }

  user = {
    _id: '',
    account: '',
    updatedAt: '',
    createdAt: '',
    avatar: '',
    bio: '',
    name: '',
    type: '',
    __v: 0,
    customProfile: '',
    facebook: '',
    email: '',
    instagram: '',
    telegram: '',
    twitter: '',
    webSite: '',
    role: '',
  };

  image: IImage = {
    _id: '',
    title: '',
    likes: 0,
    likers: [''],
    description: '',
    tags: [''],
    nft: {
      _id: '',
      image: '',
      index: 1,
      previewImage: '',
      rawImage: '',
      parameters: { name: 'fake' },
    },
    pirs: {
      creatorRate: 0,
      investorRate: null,
    },
    users: [this.user as IProfile],
    collectionName: '',
    collectionOwner: '',
    owner: '',
    creator: '',
  };

  backgroundImage = [
    {
      value: '0',
      label: 'None',
    },
    {
      value: '1',
      label: 'Wall',
    },
    {
      value: '2',
      label: 'Big Wall',
    },
    {
      value: '6',
      label: 'Room',
    },
    {
      value: '3',
      label: 'Bedroom',
    },
    {
      value: '4',
      label: 'High-Tech Gallery',
    },
    {
      value: '5',
      label: 'Open Gallery',
    },
    {
      value: '7',
      label: 'PsyVerse',
    },
  ]
}

</script>
<style scoped>
.text-description{
  word-wrap: break-word;
}

.details{
  margin-left: 25px;
  margin-top: -6px;
}

.q-page-container{
  padding: 10px;
}

.text-download {
  color:#F4538D;
  text-align:center;
  margin-top: 7px;
}

.btn-newPainting {
  width: 100px;
  height: 44px;
}

.img{
  max-height: 100%;
  max-width: 650px;
}

.text-img{
  width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-btnCreatepainter{
  display: flex;
  margin: auto;
  margin-top: 10px
}

.container-text-share{
  width: 50%;
}

@media (max-width: 450px) {
.img{
  width: 80vw;
}

.details{
  margin-left: 0;
  margin-top: 10px;
}

.btn-newPainting {
  width: 80vw;
  height: 39px;
  margin-bottom: 15px;
  margin-left: 3vw;
  margin-top: 1px;
}

.btn-btnCreatepainter {
  width: 80vw;
  height: 39px;
}

.container-text-share{
  width: 100%;
}

.text-img{
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
}
</style>
