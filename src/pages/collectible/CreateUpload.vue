<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import UploadBox from '../../components/common/UploadBox.vue';

class PropsTypes {
  uploadLabel: string|undefined;
}

@Options({
  components: {
    UploadBox,
  },
})
export default class CreateUpload extends Vue.with(PropsTypes) {
}
</script>

<template>
  <upload-box
    inner-width="697px"
    inner-height="550px"
  >
    {{ $t($props.uploadLabel) }}
  </upload-box>
</template>

<style lang="scss" scoped>
</style>
