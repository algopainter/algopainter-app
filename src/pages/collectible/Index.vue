<template>
  <div class="row justify-evenly">
    <create class="q-ma-sm" />
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

.margin {
  margin: 25px 25px;
}
</style>
