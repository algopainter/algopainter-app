<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div>
      <auctions-list @favoriteClicked="favoriteClicked" />
    </div>
    <!--
    <div class="header">
      {{ $t('dashboard.homePage.exploreAuctions') }}
    </div>
    <div>
      <auctions-explorer @favoriteClicked="favoriteClicked" />
    </div>
    -->
    <div class="header q-mb-sm">
      {{ $t('dashboard.homePage.collectiblesGallery') }}
    </div>
    <div>
      <home-page-gallery
        @favoriteClicked="favoriteClicked"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { HomePageGallery } from 'components/gallery';
import AuctionsList from 'src/components/auctions/AuctionsList.vue';
import AuctionsExplorer from 'src/components/auctions/AuctionsExplorer.vue';

@Options({
  components: {
    HomePageGallery,
    AuctionsList,
    AuctionsExplorer,
  },
})
export default class HomePage extends Vue {
  favoriteClicked() {
    this.$emit('favoriteClicked');
  }
}
</script>

<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.header {
  margin-bottom: 1.0rem
}

</style>
