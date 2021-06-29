<template>
  <div class="col-4">
    <q-img
      class="img"
      :src="img"
    />
    <p>{{ name }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
class Props {
  img = prop({
    type: String,
    required: true,
  });

  name = prop({
    type: String,
    required: true,
  });
}
@Options({
  components: {},
})
export default class IaArtist extends Vue.with(Props) {}
</script>

<style scoped>
.img {
  width: 100%;
  max-width: 150px;
  height: auto;
  cursor: pointer;
}
</style>
