<template>
  <div class="text-subtitle2 sub-title">
    {{ $t('createCollectible.title.sub') }}
  </div>
  <div class="row q-col-gutter-md">
    <div
      v-for="imgBtn in imageButtons"
      :key="imgBtn.id"
    >
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
    class="row q-mt-md"
  >
    <create-upload upload-label="createCollectible.create.importFile" />
  </div>
  <div
    v-if="activeFormId === 'createWithArtist'"
    class="row"
  >
    <ia-artist
      v-for="art in arts"
      :key="art.id"
      :img="art.img"
      :name="art.name"
      class="col-4 items-end"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ImageButton from '../../components/common/ImageButton.vue';
import CreateUpload from './CreateUpload.vue';
import { IImageButton } from '../../models/IImageButton';
import IaArtist from './IaArtist.vue';

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

  arts = [
    {
      id: 1,
      img: '/images/Hashly.svg',
      name: 'Hashly Gwei',
    },
    {
      id: 2,
      img: '/images/Angelo.svg',
      name: 'Angelo Fracthereum',
    },
    {
      id: 3,
      img: '/images/Claude.svg',
      name: 'Claude Monero',
    },
  ];

  activeFormId: string | null = null;

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
}
</script>

<style lang="scss" scoped>
.sub-title {
  font-size: 22px;
  margin-bottom: 15px;
}
</style>
