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
  <div class="ap-preview-box" v-if="$props.item">
    <auction-item :key="$props.item.id" :auction="$props.item" />
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
import { IAuctionItem } from 'src/models/IAuctionItem';
import { Vue, Options, prop } from 'vue-class-component';
import { AuctionItem } from 'components/auctions';

class PropsTypes {
  item = prop<IAuctionItem>({ required: true });
}

@Options({
  components: {

  },
})
export default class Preview extends Vue.with(Props) {

}
export default class Preview extends Vue.with(PropsTypes) {}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  max-width: 400px;
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  height: 60vh;
  width: 30vw;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
