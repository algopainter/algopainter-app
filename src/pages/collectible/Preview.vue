<template>
  <div
    v-if="idBtn === 'importFile'"
    class="text-h6"
  >
    {{ $t('createCollectible.create.preview') }}
    <section
      class="row text-h6 ap-preview-box justify-center items-center"
    >
      <p class="text-center">
        {{ $t('createCollectible.create.previewText') }}
      </p>
    </section>
  </div>
  <div v-else>
    <h1>{{ idBtn }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
class Props {
  idBtn = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {

  },
})
export default class Preview extends Vue.with(Props) {

}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  height: 60vh;
  width: 30vw;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
