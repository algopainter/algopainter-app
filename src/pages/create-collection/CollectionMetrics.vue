<template>
  <p>Collection Metrics</p>
  <q-input
    v-model="form.amount"
    :label="$t('dashboard.newPainting.gwei.inspirationalText')"
    maxlength="64"
    counter
  />
  <div class="algo-radio">
    <p class="label">{{ $t('dashboard.newPainting.gwei.randomColors') }}</p>
    <div class="row q-col-gutter-md">
      <q-radio
        v-model="form.pricing"
        :label="$t('dashboard.newPainting.gwei.yesLabel')"
        class="option"
        :val="'true'"
      />
      <q-radio
        v-model="form.pricing"
        :label="$t('dashboard.newPainting.gwei.noLabel')"
        class="option"
        :val="'false'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

class Props {
  step = prop({
    type: Number,
    required: true,
  });
}

export default class CollectionMetrics extends Vue.with(Props) {
  form = {
    amount: 500,
    pricing: 'true'
  }

  @Watch('step')
  onStepChanged() {
    if (this.step > 2) {
      this.$emit('data', this.form, this.step);
    };
  }
}
</script>
<style lang="scss">

</style>
