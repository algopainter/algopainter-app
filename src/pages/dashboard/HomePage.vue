<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div>
      <auctions-list />
    </div>
    <div class="header gallery">
      {{ $t('dashboard.homePage.collectiblesGallery') }}
    </div>
    <div>
      <home-page-gallery />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { HomePageGallery } from 'components/gallery';
import AuctionsList from 'pages/dashboard/auctions/AuctionsList.vue';

@Options({
  components: {
    HomePageGallery,
    AuctionsList,
  },
})
export default class HomePage extends Vue {

}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.header.gallery{
  padding-bottom: 1rem;
}
</style>
