<template>
  <div :hidden="$q.screen.lt.md">
    <div class="text-h6">
      {{ $t('createCollectible.create.preview') }}
    </div>
    <div class="row text-h6 ap-preview-box justify-center items-center">
      <div class="col q-mt-lg">
        <p
          v-if="imagePreview === null"
          class="text-center"
        >
          {{ $t('createCollectible.create.previewText') }}
        </p>
        <div v-else>
          <q-img
            :src="imagePreview"
            class="img"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-center q-py-md q-mt-md">
    <algo-button
      type="submit"
      color="primary"
      :label="$t('createCollectible.create.btnCreate')"
      @click="OpenModal = true"
    />
  </div>
  <mint-modal
    v-model="OpenModal"
    :open-modal="OpenModal"
  />
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import MintModal from './MintModal.vue';
class Props {
 imagePreview = prop({
   type: String,
   required: true,
 })
}
@Options({
  components: {
    AlgoButton,
    MintModal,
  },
})

export default class Preview extends Vue.with(Props) {
OpenModal: boolean = false;
}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  max-width: 400px;
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  height: 450px;
  width: 350px;
  border-radius: 10px;
}
.img{
  width: 95%;
  height: 20%;
}

</style>
