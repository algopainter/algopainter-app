<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="account-details q-pa-lg">
      <UserAccountDetails />
    </div>
    <div class="header">
      {{ $t('dashboard.homePage.myGallery') }}
    </div>
    <div>
      <UserGalleryOverview />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import UserAccountDetails from 'components/home-page/UserAccountDetails.vue';
import UserGalleryOverview from 'components/home-page/user-gallery-overview/UserGalleryOverview.vue';

@Options({
  components: {
    UserAccountDetails,
    UserGalleryOverview,
  },
})
export default class MyGallery extends Vue {
}
</script>

<style lang="scss" scoped>
.account-details {
  border: 2px dashed $primary;
  border-radius: 20px;
}
</style>
