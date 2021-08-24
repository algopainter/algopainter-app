<template>
  <div v-if="loading === false">
    <div class="row justify-between">
      <div class="row justify-between conteiner-text-share">
        <div
          class="text-img"
        >
          <p class="text-bold text-h5">
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
      <div>
        <algo-button
          :label="$t('dashboard.gallery.newPainting')"
          class="q-ma-xs btn-newPainting"
          color="primary"
          @click="OpenModalArtist()"
        />
        <NewPaintingModal v-model="openModal" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-11 col-sm-5 col-md-6">
        <div class="row justify-center">
          <q-img
            class="img"
            :src="image.nft.image"
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
            v-model="choiseBackground"
            :options="backgroundImage"
            :label="$t('dashboard.viewArt.choiseBackground')"
            color="primary"
            dense
          />
        </div>

        <algo-button
          color="primary"
          class="q-ma-xs btn-btnCreatepainter"
          :label="$t('dashboard.viewArt.btnCreatepainter')"
          @click="OpenModalArtist()"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 q-ma-lg">
        <div class="column items-center">
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
            <p> {{ image.description }}</p>
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
  choiseBackground: string = '';

  OpenModalArtist() {
    this.openModal = true;
    console.log('CollectiblesGallery');
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
      img: '',
      // 'https://gwei.algopainter.art/
      // ?width=714&amp;
      // height=714&amp;
      // text={image.title}&amp;
      // inspiration=1&amp;
      // useRandom=false&amp;
      // probability=0.5&amp;
      // wallType={{backgroundImage.value}}&amp;
      // overlay=4&amp;
      // overlayOpacity=10&quot;)',
    },
    {
      value: '1',
      label: 'Wall',
      img: '',
    },
    {
      value: '2',
      label: 'Big Wall',
      img: '',
    },
    {
      value: '3',
      label: 'Room',
      img: '',
    },
    {
      value: '4',
      label: 'Bedroom',
      img: '',
    },
    {
      value: '5',
      label: 'High-Tech Gallery',
      img: '',
    },
    {
      value: '6',
      label: 'Open Gallery',
      img: '',
    },
    {
      value: '7',
      label: 'PsyVerse',
      img: '',
    },
  ]

  collectionArtController: CollectionArtController = new CollectionArtController();

  wasLiked: boolean = false;

  likes!: number;

  imageOwner!: IImageUser;

  get account() {
    return this.$store.state.user.account as string;
  }

  mounted() {
    void this.getDetailsData();
  }

  async getDetailsData() {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const data = await api.get(`images/${this.$route.params.id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.image = data.data as IImage;
      this.likes = this.image.likes;
      this.imageOwner = UserUtils.getUsersByRole(this.image.users as IImageUser[], 'owner')[0];
      this.loadWasLiked();
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
}

</script>
<style scoped>
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

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
.img{
  width: 100%;
  border-radius:5%
}
.text-img{
  width: 500px;
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

.btn-newPainting {
  width: 80vw;
  height: 39px;
}
.btn-btnCreatepainter {
  width: 80vw;
  height: 39px;
}
.conteiner-text-share{
  width: 100%;
}
.text-img{
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
}
</style>
