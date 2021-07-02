<template>
  <div class="row justify-between">
    <div class="col-lg-6 col-md-7 col-xs-12">
      <create />
    </div>
    <div class="col-lg-2 col-md-4 col-xs-12 q-preview-wrapper">
      <div class="row">
        <preview :item="previewItem" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import Create from './Create.vue';
import Preview from './Preview.vue';

@Options({
  components: {
    Create,
    Preview,
  },
})
export default class Index extends Vue {
  previewItem: IAuctionItem = {
    id: '1',
    art: {
      id: '1',
      name: 'Art Abstract Name',
      source: 'placeholder',
      price: 120,
      bidBack: 0.1,
      keywords: '#art',
      pirs: {
        creators: 0.08,
        investors: 0.05,
      },
      importantPeople: [
        {
          id: '1',
          name: 'Billy Nguyen',
          picture: 'https://randomuser.me/api/portraits/men/5.jpg',
        },
        {
          id: '2',
          name: 'Beverley Weaver',
          picture: 'https://randomuser.me/api/portraits/women/31.jpg',
        },
        {
          id: '3',
          name: 'Leonard Ryan',
          picture: 'https://randomuser.me/api/portraits/men/11.jpg',
        },
      ],
    },
    numberOfBids: 1,
    highestBid: 300,
  };
}
</script>

<style lang="scss" scoped>
.q-preview-wrapper {
  max-width: 400px;
  min-width: 400px;
}
</style>
