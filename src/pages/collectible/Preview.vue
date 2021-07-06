<template>
  <div class="text-h6">
    {{ $t('createCollectible.create.preview') }}
  </div>
  <div class="ap-preview-box" v-if="$props.item">
    <auction-item :key="$props.item.id" :auction="$props.item" />
  </div>
</template>

<script lang="ts">
import { IAuctionItem } from 'src/models/IAuctionItem';
import { Vue, Options, prop } from 'vue-class-component';
import { AuctionItem } from 'components/auctions';

class PropsTypes {
  item = prop<IAuctionItem>({ required: true });
}

@Options({
  components: {
    AuctionItem,
  },
})
export default class Preview extends Vue.with(PropsTypes) {}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  max-width: 400px;
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
