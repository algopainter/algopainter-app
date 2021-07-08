<template>
  <div class="row justify-center">
    <create />
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
