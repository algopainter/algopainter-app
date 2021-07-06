<template>
  <div class="row justify-between">
    <div class="col-lg-6 col-md-7 col-xs-12">
      <create />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Create from './Create.vue';

@Options({
  components: {
    Create,
  },
})
export default class Index extends Vue {}
</script>

<style lang="scss" scoped>
.q-preview-wrapper {
  max-width: 400px;
  min-width: 400px;
}
</style>
