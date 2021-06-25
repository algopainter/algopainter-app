<template>
  <q-page class="row q-gutter-lg q-pb-lg">
    <div class="col-12 col-sm-6">
      <div class="q-pa-lg">
        <account-details />
        <div class="header q-gutter-md">
          {{ $t('dashboard.sellYourArt.putMarketplace') }}
        </div>
        <div class=" row q-gutter-md">
          <algo-button
            class="btn-fixed-width"
            color="primary"
            outline
            :label="$t('dashboard.sellYourArt.FixedPrice')"
          />
          <algo-button
            class="btn-fixed-width"
            color="primary"
            outline
            :label="$t('dashboard.sellYourArt.Timed')"
          />
        </div>
        <div
          text-subtitle2
          class="text-weight-bold q-mt-xs q-gutter-md"
        >
          {{ $t('dashboard.sellYourArt.EnterPrice') }}
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <you-art />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import AlgoButton from 'components/common/Button.vue';

import YouArt from 'components/sellYourArt/YouArt.vue';

@Options({
  components: { AlgoButton, YouArt },
})
export default class sellYourArt extends Vue {}
</script>

<style lang="scss" scoped>
.btn-fixed-width{
  width: 223px;
  height: 44px;
}
</style>
