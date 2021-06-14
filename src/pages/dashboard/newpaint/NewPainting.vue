<template>
  <div class="row q-mt-xl">

    <div class="col-xs-12 col-sm-6 items-center ">
      <div class=" q-col-gutter-md row justify-center items-center ">
        <q-img
          src="../../../assets/images/hashly-gwei.svg"
          style="height: 429px; width: 230px; border:none;">
        </q-img>
      </div>
    </div>

    <div class="col-xs-12 col-sm-6 ">
      <div class="header">
        {{ $t('dashboard.newpainting.create') }}
      </div>

      <div class="q-mt-lg">
        <label>{{ $t('dashboard.newpainting.TypeAText') }}</label>
        <input v-bind:maxlength="limit"
        v-model="textType" required class="full-width typeText"/>
        <p class="justify-end text-right">
          {{typed}}{{ $t('dashboard.newpainting.trace') }}{{remains}}
        </p>
        <div class="col-xs-6 col-sm-3 ">
          <span>{{ $t('dashboard.newpainting.PaintOnWall') }}</span>
          <div class="row">
            <q-radio  v-model="hang" val="Yes" label="Yes"></q-radio>
            <q-radio  v-model="hang" val="No" label="No"></q-radio>
          </div>
        </div>

        <div>
          <span>{{ $t('dashboard.newpainting.CoresAleatórias') }}</span>
          <div class="row">
            <q-radio v-model="range" val="yes" label="Yes"></q-radio>
            <q-radio v-model="range" val="no" label="No"></q-radio>
          </div>
          <div v-if="range==='yes'" class="q-mt-md" >
            <p>{{ $t('dashboard.newpainting.CollorInversionProbability') }}</p>
            <q-slider v-model="slider" color="primary" :min="0" :max="50"/>
          </div>
        </div>

        <div class="q-mt-md">
          <p>{{ $t('dashboard.newpainting.YourInspiration') }}</p>
          <div class="row">
            <div class="col-xs-12 col-sm-6 items-center">
              <div class="col">
                <q-radio  v-model="test" val="Random" label="Random"></q-radio>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="Calm" label="Calm"></q-radio>
              </div>
              <div class="col">
                <q-radio  v-model="test"
                val="Colorfull blocks" label="Colorfull blocks"/>
              </div>
              <div class="col">
                <q-radio  v-model="test"
                val="Colorfull paths" label="Colorfull paths"/>
              </div>
            </div>

            <div class="col-xl-12 col-sm-2 items-center">
              <div class="col">
                <q-radio  v-model="test" val="Hot flows" label="Hot flows"/>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="Galaxy" label="Galaxy"></q-radio>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="5000 Days" label="5000 Days"/>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 q-mb-lg items-center">
          <div class="q-col-md row justify-center items-center">
            <q-btn color="primary" class="q-px-xl" label="Genarate Painting"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class NewPainting extends Vue {
  private textType: string = ''
  private limit: number = 64
  private empty: number = 0
  private test: string = 'line'
  private slider: number = 0
  private range: string = ''
  private hang: string = 'line'

  get remains (): number {
    return this.limit - this.textType.length;
  }

  get typed (): number {
    return this.empty + this.textType.length;
  }
}
</script>

<style scoped>
.typeText{
  border: none;
  border-bottom: 1px solid black;
}
.typeText:focus{
  border-top: none;
}
</style>
