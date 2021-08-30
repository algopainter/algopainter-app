<template>
  <div v-if="loading === false">
    <div class="row justify-between">
      <div class=" col-xs-12 col-sm-6 col-md-6 row justify-between conteiner-text-share">
        <div>
          <p class="text-bold text-h5 text-img">
            {{ $t('dashboard.homePage.symbol') }}{{ image.nft.index }} {{ image.title }}
          </p>
          <q-tooltip
            class="bg-primary"
          >
            {{ image.title }}
          </q-tooltip>
        </div>

        <div class="">
          <!--
            <LikeAnimation
              :liked="wasLiked"
              :likes="likes"
              @favoriteClicked="favoriteClicked"
            />
            -->
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
          @click="OpenModalArtist()"
        />
        <NewPaintingModal v-model="openModal" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6">
        <div class="row justify-center">
          <q-img
            v-if="backgroundChange === false"
            class="img"
            :src="imageUrl"
          />
          <q-img
            v-else
            class="img"
            :src="imageUrl"
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
          @click="OpenModalArtist()"
        />
      </div>
      <div class="col-xs-12 col-sm-5 col-md-5 details">
        <div>
          <div class="col">
            <p class="text-bold text-h5 q-mb-sm">
              {{ $t('dashboard.viewArt.details') }}
            </p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.algoPainter') }}
            </span>
            <p>{{ image.collectionName }} </p>
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
            <p> {{ image.description }} </p>
            <div v-if="image.collectionName === 'Gwei'">
              <p class="text-bold text-primary text-h6">
                {{ $t('dashboard.viewArt.pararmeters') }}
              </p>
              <span>{{ $t('dashboard.viewArt.text') }}</span>
              <span class="text-bold">
                {{ image.nft.parameters.text }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.randomColor') }}</span>
              <span class="text-bold">
                {{ image.nft.parameters.useRandom === 'true' ? $t('dashboard.viewArt.yes') : $t('dashboard.viewArt.no') }}
              </span><br>
              <div v-if="image.nft.parameters.useRandom === 'true'">
                <span>{{ $t('dashboard.viewArt.probability') }}</span>
                <span class="text-bold">
                  {{ image.nft.parameters.probability }}
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
                {{ image.owner }}
              </span><br>
              <span>{{ $t('dashboard.viewArt.mint') }}</span>
              <span class="text-bold">
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
import NewPaintingModal from '../../../components/modal/NewPaintingModal.vue';
import UserUtils from 'src/helpers/user';
import { IImageUser } from 'src/models/IImageUser';
import { IProfile } from 'src/models/IProfile';

@Options({
  components: { AlgoButton, ShareArtIcons, LikeAnimation, ViewArtSkeleton, NewPaintingModal },
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
  openModal: boolean = false;
  selectAccount: string = '';
  options: string = 'None';
  chooseBackground: string = '';
  backgroundChange: boolean = false;
  loadingImage: boolean = true;
  imageUrl: string = '';

  mounted() {
    void this.getDetailsData();
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

  // preciso do id da imagem que ja foi fetched
  // vou fazer um request para o api https://algopainter-api.netlify.app/api/images/611548094fb5ed1d60bafd0a
  // Alterar os parâmetros da imagem para ficar igual

  changeBackground(value: string) {
    this.backgroundChange = true;
    const parameters: Record<string, unknown> = this.image.nft.parameters;
    const arrayKeys = Object.keys(parameters);
    const arrayValues: (string | number)[] = Object.values(parameters) as (string | number)[];
    const arrayLength = arrayKeys.length;
    let URL = 'https://gwei.algopainter.art/?';
    let counter = 0;
    arrayKeys.forEach(parameter => {
      counter++;
      if (parameter !== 'amount' && parameter !== 'description') {
        if (parameter === 'place') {
          parameter = 'wallType';
          if (counter !== arrayLength) {
            URL = URL.concat(`${parameter}=${value}&`);
            return;
          } else {
            URL = URL.concat(`${parameter}=${value}`);
            return;
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let arrayValue: string | number = arrayValues[counter - 1];
        if (typeof (arrayValue) === 'string') {
          arrayValue = arrayValue.split(' ').join('%20');
        }
        if (counter !== arrayLength) {
          URL = URL.concat(`${parameter}=${arrayValue}&`);
        } else {
          URL = URL.concat(`${parameter}=${arrayValue}`);
        }
      }
    });
    this.imageUrl = URL;
  }

  OpenModalArtist() {
    this.openModal = true;
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
    this.$emit('favoriteClicked');
    if (this.isConnected) {
      wasLiked ? void this.postFavoriteArt() : void this.deleteFavoriteArt();
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
          }
        },
        (error) => {
          console.log('"like" post error: ', error);
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
          }
        },
        (error) => {
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
      previewImage: '',
      rawImage: '',
      parameters: { name: 'fake' },
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
  max-height: 650px;
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

.conteiner-text-share{
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

.conteiner-text-share{
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
