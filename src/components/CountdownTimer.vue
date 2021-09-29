<template>
  <div class="row q-col-gutter-md">
    <div class="col-3 item">
      <div class="value">
        {{ days }}
      </div>
      <div class="label">
        {{ $t('common.days') }}
      </div>
    </div>
    <div class="col-3 item">
      <div class="value">
        {{ hours }}
      </div>
      <div class="label">
        {{ $t('common.hours') }}
      </div>
    </div>
    <div class="col-3 item">
      <div class="value">
        {{ minutes }}
      </div>
      <div class="label">
        {{ $t('common.minutes') }}
      </div>
    </div>
    <div class="col-3 item">
      <div class="value">
        {{ seconds }}
      </div>
      <div class="label">
        {{ $t('common.seconds') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

@Options({})
export default class CountdownTimer extends Vue {
  @Prop({ default: 0 }) days!: number;
  @Prop({ default: 0 }) hours!: number;
  @Prop({ default: 0 }) minutes!: number;
  @Prop({ default: 0 }) seconds!: number;
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .value {
    font-weight: bold;
    font-size: 1.2rem;
  }
}
</style>
