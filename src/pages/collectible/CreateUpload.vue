<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import UploadBox from '../../components/common/UploadBox.vue';

class PropsTypes {
  uploadLabel: string | undefined;
  titleLabel: string | undefined;
  titleMaxlength: number | undefined;
  descriptionLabel: string | undefined;
  descriptionMaxlength: number | undefined;
}

interface FormData {
  title: string;
  description: string;
  putOnSale: boolean;
}

@Options({
  components: {
    UploadBox,
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
  formData: FormData = {
    title: '',
    description: '',
    putOnSale: false,
  };
}
</script>

<template>
  <div class="row">
    <div class="col">
      <upload-box>
        {{ $t('createCollectible.create.fields.uploadLabel') }}
      </upload-box>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-input
        v-model="formData.title"
        bottom-slots
        :label="$t('createCollectible.create.fields.titleLabel')"
        counter
        :maxlength="$props.titleMaxlength"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-input
        v-model="formData.description"
        bottom-slots
        :label="$t('createCollectible.create.fields.descriptionLabel')"
        counter
        :maxlength="$props.descriptionMaxlength"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-toggle
        v-model="formData.putOnSale"
        :label="$t('createCollectible.create.fields.putOnSaleLabel')"
        left-label
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
