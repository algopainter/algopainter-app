<template>
  <div class="col-xs-12 col-sm-12 col-lg-7 col-md-6 full-width">
    <div class="text-subtitle2 sub-title">
      {{ $t('createCollectible.title.sub') }}
    </div>
    <div class="row q-gutter-md">
      <div v-for="imgBtn in imageButtons" :key="imgBtn.id" class="col">
        <image-button
          :id="imgBtn.id"
          :img-src="imgBtn.imgSrc"
          :img-width="imgBtn.imgWidth"
          :img-height="imgBtn.imgHeight"
          :is-disabled="imgBtn.isDisabled"
          :cb="clickedButton"
        >
          {{ $t(imgBtn.labelKey) }}
        </image-button>
      </div>
    </div>
    <div
      v-if="activeFormId === 'importFile'"
      class="col q-mt-md"
    >
      <div>
        <create-upload
          title-maxlength="255"
          description-maxlength="255"
          @close="eventClose"
          @preview-evento="eventPreview"
        />
      </div>
    </div>
    <div v-if="activeFormId === 'createWithArtist'" class="col q-mt-md">
      <div v-if="loading === false">
        <div
          v-for="(collection, index) in formCollection"
          :key="index"
        >
          <collections :collection="collection" :descriptions="descriptions" />
        </div>
      </div>

      <div v-else>
        <CollectionsSkeleton />
      </div>
    </div>
  </div>
  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
    <div v-if="activeFormId === 'createWithArtist'" class="col q-preview">
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ImageButton from '../../components/common/ImageButton.vue';
import CreateUpload from './CreateUpload.vue';
import { IImageButton } from '../../models/IImageButton';
import IaArtist from './IaArtist.vue';
import Preview from './Preview.vue';
import Example from './Example.vue';
import { mapGetters } from 'vuex';
import ICollection from 'src/models/ICollection';
import Collections from './Collections.vue';
import CollectionsSkeleton from './CollectionsSkeleton.vue'
import moment from 'moment';

interface IAiArtist {
  id: number;
  name: string;
  title: string;
  img: string;
  isOff?: boolean;
  textSubtitle: string;
  textBody: string;
  exampleImg: string;
  batchPrince: string;
  remaining: string;
  minted: string;
  btnLink: string;
}

@Options({
  components: {
    ImageButton,
    CreateUpload,
    IaArtist,
    Preview,
    Example,
    Collections,
    CollectionsSkeleton
  },
  emits: ['createWithArtistClick', 'eventPreview', 'eventClose'],
  computed: {
    ...mapGetters('collections', {
      isNewPaintingModalOpen: 'GET_IS_NEW_PAINTING_MODAL_OPEN',
    }),
  },
})
export default class Create extends Vue {
  imageData: string | null = null;
  descriptions: boolean = true;
  loading: boolean = true;
  imageButtons: IImageButton[] = [
    {
      id: 'importFile',
      imgSrc: 'icons/default-image.svg',
      imgWidth: '80px',
      imgHeight: '80px',
      labelKey: 'createCollectible.create.importFile',
      isDisabled: true,
    },
    {
      id: 'createWithArtist',
      imgSrc: 'icons/palette-brush.svg',
      imgWidth: '90px',
      imgHeight: '80px',
      labelKey: 'createCollectible.create.createWithArtist',
      isDisabled: true,
    },
  ];

  currentArtist: IAiArtist = {
    id: 0,
    name: '',
    title: '',
    img: '',
    textSubtitle: '',
    textBody: '',
    exampleImg: '',
    batchPrince: '-',
    remaining: '-',
    minted: '-',
    btnLink: '',
  };

  formCollection: ICollection[] = [];
  form: ICollection[] = [];

  activeFormId: string | null = null;
  isNewPaintingModalOpen!: boolean;

  detalImg: string | null = null;

  clickedButton(id: string): void {
    this.activeFormId = id;

    this.imageButtons = this.imageButtons.map((item) => {
      if (item.id !== id) {
        item.isDisabled = true;
      } else {
        item.isDisabled = false;
      }
      return item;
    });
  }

  mounted() {
    void this.getCollection();
  }

  getCollection() {
    void this.$store.dispatch({
      type: 'mint/collections',
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const collection = this.$store.getters['mint/GET_COLLECTIONS'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.form = collection.data
      // eslint-disable-next-line array-callback-return
      this.formCollection = this.form.filter(function(obj) {
        if (obj.title === 'Expressions' || obj.title === 'Gwei' || (moment().isAfter(obj.metrics.endDT) === false && moment().isBefore(obj.metrics.startDT) === false)) {
          return true
        }
      })
      this.loading = false
    });
  }

  eventPreview(play: string | null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.imageData = play;
  }

  eventClose(play: string | null) {
    this.imageData = play;
  }
}
</script>

<style lang="scss" scoped>
.sub-title {
  font-size: 22px;
  margin-bottom: 15px;
}
.text-bold {
  font-size: 16px;
}
.q-preview {
  margin: 0 2vw;
}
</style>

<style lang="scss">
.q-page-container {
  padding-left: 0px;
}
</style>
