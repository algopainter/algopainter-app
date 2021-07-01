<template>
  <div class="row items-start">
    <div class="col">
      <create @artistSettled="generatePreview" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Create from './Create.vue';
import Preview from './Preview.vue';

@Options({
  components: {
    Create,
    Preview,
  },
})
export default class Index extends Vue {
  generatePreview() {
  // aqui, posso mudar o estado de algum atributo da classe
  // e então, atualizar o componente preview
  // Index vai orquestrando....
  }
}
</script>

<style lang="scss" scoped>
.q-preview-wrapper {
  max-width: 400px;
  min-width: 400px;
}
</style>
