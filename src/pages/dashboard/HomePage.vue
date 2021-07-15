<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="account-details q-pa-lg">
      <account-details />
    </div>
    <div class="header">
      {{ $t('dashboard.homePage.myGallery') }}
    </div>
    <div>
      <user-gallery-overview />
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

import {
  AccountDetails,
  UserGalleryOverview,
} from 'components/home-page';
import {
  HomePageGallery,
} from 'components/gallery';

@Options({
  components: {
    AccountDetails,
    UserGalleryOverview,
    HomePageGallery,
  },
})
export default class HomePage extends Vue {
}
</script>

<style lang="scss" scoped>
.account-details {
  border: 2px dashed $primary;
  border-radius: 20px;
}

.header.gallery{
  padding-bottom: 1rem;
}
</style>
