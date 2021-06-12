<template>
  <div class="text-h6">{{ $t('createCollectible.create.preview') }}</div>
  <div class="row">
    <div class="col ap-preview-box">
      <auction-item :key="previewItem.id" :auction="previewItem" />
    </div>
  </div>
</template>

<script lang="ts">
import { IAuctionItem } from 'src/models/IAuctionItem';
import { Vue, Options } from 'vue-class-component';
import { AuctionItem } from 'components/auctions';

@Options({
  components: {
    AuctionItem,
  },
})
export default class Preview extends Vue {
  previewItem: IAuctionItem = {
    id: '1',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [{
        id: '1',
        name: 'Billy Nguyen',
        picture: 'https://randomuser.me/api/portraits/men/5.jpg',
      }, {
        id: '2',
        name: 'Beverley Weaver',
        picture: 'https://randomuser.me/api/portraits/women/31.jpg',
      }, {
        id: '3',
        name: 'Leonard Ryan',
        picture: 'https://randomuser.me/api/portraits/men/11.jpg',
      }],
    },
    numberOfBids: 1,
    highestBid: 300,
  };
}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  padding: 25px 50px 25px 50px;
  border: 2px dashed #F4538D;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>