<template>
  <div
    v-if="year === 0"
    class="row q-col-gutter-md"
  >
    <div class="col-2 item">
      <div class="value">
        {{ days }}
      </div>
      <div class="label">
        {{ $t('common.days') }}
      </div>
    </div>
    <div class="col-2 item">
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
  <div
    v-else
    class="row q-col-gutter-md"
  >
    <div class="col-1 item-year">
      <div class="value">
        {{ year }}
      </div>
      <div class="label">
        {{ $t('common.year') }}
      </div>
    </div>
    <div class="col-2 item">
      <div class="value">
        {{ days }}
      </div>
      <div class="label">
        {{ $t('common.days') }}
      </div>
    </div>
    <div class="col-2 item">
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
  @Prop({ default: 0 }) year!: number;
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
.item-year{
  display: flex;
  margin-right: 5px;
  flex-direction: column;
  align-items: center;
   .value {
    font-weight: bold;
    font-size: 1.2rem;
  }
}
</style>
