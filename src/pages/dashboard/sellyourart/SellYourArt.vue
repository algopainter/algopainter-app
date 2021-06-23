<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="q-pa-lg">
      <account-details />
    </div>
    <div class="header q-ml-xl">
      {{ $t('dashboard.sellYourArt.putMarketplace') }}
    </div>
    <div class="q-gutter-md">
      <algo-button
        class="btn-fixed-width"
        color="primary"
        outline
        :label="$t('dashboard.sellYourArt.FixedPrice')"
      />
      <algo-button
        class="btn-fixed-width "
        color="primary"
        outline
        :label="$t('dashboard.sellYourArt.Timed')"
      />
    </div>
    <div
      text-subtitle2
      class="text-weight-bold q-ml-xl q-mt-xs"
    >
      {{ $t( 'dashboard.sellYourArt.EnterPrice') }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AlgoButton from 'components/common/Button.vue';

@Options({
  components: { AlgoButton },
})
export default class sellYourArt extends Vue {
}
</script>

<style lang="sass">
.btn-fixed-width
  width: 223px
  height: 44px
</style>
