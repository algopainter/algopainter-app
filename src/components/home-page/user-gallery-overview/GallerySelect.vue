<template>
  <div class="row">
    <div class="col-12 col-md-6 col-lg-6">
      <img
        :src="art.nft.previewImage"
        alt="img art"
      >
    </div>
    <div class="col-12 col-md-6 col-lg-6">
      <div>
        {{ $t('dashboard.homePage.symbol') }}{{ art.nft.index }} {{ art.title }}
      </div>
      <div class="text">
        {{ art.nft.parameters.description }}
      </div>
      <div>
        {{ $t('dashboard.sellYourArt.ireceive') }}
      </div>
      <div>
        <algo-button
          :label="$t('dashboard.homePage.stakeAlgo')"
          color="primary"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import { IMyGallery } from 'src/models/IMyGallery';
import AlgoButton from 'components/common/Button.vue';

class Props {
  art = prop({
    type: Object as PropType<IMyGallery>,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
  },
})

export default class gallerySelect extends Vue.with(Props) {

}

</script>

<style scoped>
.text{
  white-space: nowrap;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
