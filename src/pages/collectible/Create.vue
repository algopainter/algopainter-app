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
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import ImageButton from '../../components/common/ImageButton.vue';
import { IImageButton } from '../../models/IImageButton';

@Options({
  components: {
    ImageButton,
  },
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

  clickedButton(id: string): void {
    this.imageButtons = this.imageButtons.map((item) => {
      if (item.id !== id) { item.isDisabled = true; } else { item.isDisabled = false; }
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
