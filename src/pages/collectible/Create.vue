<template>
  <div class="text-subtitle2 sub-title">
    {{ $t('createCollectible.title.sub') }}
  </div>
  <div class="row q-col-gutter-md">
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
  <div v-if="activeFormId === 'importFile'" class="q-mt-md">
    <create-upload title-maxlength="255" description-maxlength="255" />
  </div>
  <div
    v-if="activeFormId === 'createWithArtist'"
    class="col q-mt-md"
  >
    <div>
      <p class="text-bold text-subtitle2">
        {{ $t('createCollectible.selectAi.title') }}
      </p>
    </div>
    <div class="row">
      <ia-artist
        v-for="art in arts"
        :key="art.id"
        :img="art.img"
        :name="art.name"
        :is-off="art.isOff"
        :is-borda="clickImg"
        class="col-4"
        @click="setCurrentArtist(art.id)"
      />
    </div>
    <div>
      <p class="text-h6 text-weight-bold">
        {{ $t(currentArtist.title) }}
      </p>
      <p class="text-weight-medium">
        {{ $t(currentArtist.text1) }}
      </p>
      <p class="text-weight-medium">
        {{ $t(currentArtist.text2) }}
      </p>
    </div>
  </div>
  <div v-if="activeFormId === 'createWithArtist'" class="row" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ImageButton from '../../components/common/ImageButton.vue';
import CreateUpload from './CreateUpload.vue';
import { IImageButton } from '../../models/IImageButton';
import IaArtist from './IaArtist.vue';

interface IAiArtist {
  id: number;
  name: string;
  title: string;
  img: string;
  isOff?: boolean;
  text1: string;
  text2: string;
}

@Options({
  components: {
    ImageButton,
    CreateUpload,
    IaArtist,
  },
  emits: ['createWithArtistClick'],
})
export default class Create extends Vue {
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
    text1: '',
    text2: '',
  };

  setCurrentArtist(id: number) {
    this.currentArtist = this.arts.filter((art) => (art.id === id))[0];
    this.$emit('artistSettled');
  }

  arts: IAiArtist[] = [
    {
      id: 1,
      img: '/images/Hashly.svg',
      name: 'Hashly Gwei',
      title: 'createCollectible.selectAi.titleHashly',
      text1: 'createCollectible.selectAi.textHashly1',
      text2: 'createCollectible.selectAi.textHashly2',
      isOff: true,
    },
    {
      id: 2,
      img: '/images/Angelo.svg',
      name: 'Angelo Fracthereum',
      title: 'createCollectible.selectAi.titleAngelo',
      text1: 'createCollectible.selectAi.textAngelo1',
      text2: '',
      isOff: true,
    },
    {
      id: 3,
      img: '/images/Claude.svg',
      name: 'Claude Monero',
      title: 'createCollectible.selectAi.titleClaude',
      text1: 'createCollectible.selectAi.textClaude1',
      text2: 'createCollectible.selectAi.textClaude2',
      isOff: true,
    },
  ];

  activeFormId: string | null = null;

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

  clickImg(name: string): void {
    this.detalImg = name;
    this.arts = this.arts.map((item) => {
      if (item.name !== name) {
        item.isOff = true;
      } else {
        item.isOff = false;
      }
      return item;
    });
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
</style>
