<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <q-card class="account-details q-pa-lg">
      <account-details />
    </q-card>
    <div>
      <MyGalleryOverview />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { AccountDetails } from 'components/home-page';
import MyGalleryOverview from 'src/components/home-page/user-gallery-overview/MyGalleryOverview.vue';

@Options({
  components: {
    AccountDetails,
    MyGalleryOverview,
  },
})
export default class MyGallery extends Vue {
}
</script>

<style lang="scss" scoped>
.account-details {
  border-radius: 20px;
}
</style>
