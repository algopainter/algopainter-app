<template>
  <div class="row q-mt-xl">

    <div class="col-xs-12 col-sm-6 items-center ">
      <div class=" q-col-gutter-md row justify-center items-center ">
        <q-img
          src="../../../assets/images/hashly-gwei.svg"
          class="img"/>
      </div>
    </div>

    <div class="col-xs-12 col-sm-6 ">
      <div class="header">
        {{ $t('dashboard.newPainting.create') }}
      </div>

      <div class="q-mt-lg">
        <label>{{ $t('dashboard.newPainting.TypeAText') }}</label>
        <q-input v-model="textType" v-bind:maxlength="limit"></q-input>
        <p class="justify-end text-right">
          {{typed}}{{ $t('dashboard.newPainting.trace') }}{{remains}}
        </p>
        <div class="col-xs-6 col-sm-3 ">
          <span>{{ $t('dashboard.newPainting.PaintOnWall') }}</span>
          <div class="row">
              <q-radio  v-model="hang" val="Yes"
                :label="$t('dashboard.newPainting.YesLabel')"/>
              <q-radio  v-model="hang" val="No"
              :label="$t('dashboard.newPainting.NoLabel')"/>
          </div>
        </div>

        <div>
          <span>{{ $t('dashboard.newPainting.CoresAleatórias') }}</span>
          <div class="row">
              <q-radio v-model="range" val="yes"
                :label="$t('dashboard.newPainting.YesLabel')"/>
              <q-radio v-model="range" val="no"
                :label="$t('dashboard.newPainting.NoLabel')"/>
          </div>
          <div v-if="range==='yes'" class="q-mt-md" >
            <p>{{ $t('dashboard.newPainting.CollorInversionProbability') }}</p>
            <q-slider v-model="slider" color="primary" :min="0" :max="50"/>
          </div>
        </div>

        <div class="q-mt-md">
          <p>{{ $t('dashboard.newPainting.YourInspiration') }}</p>
          <div class="row">
            <div class="col-xs-12 col-sm-6 items-center">
              <div class="col">
                <q-radio  v-model="test" val="Random"
                :label="$t('dashboard.newPainting.Random')"/>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="Calm"
                :label="$t('dashboard.newPainting.Calm')"/>
              </div>
              <div class="col">
                <q-radio  v-model="test"
                val="Colorfull-blocks"
                :label="$t('dashboard.newPainting.Colorfull')"/>
              </div>
              <div class="col">
                <q-radio  v-model="test"
                val="Colorfull-paths"
                :label="$t('dashboard.newPainting.paths')"/>
              </div>
            </div>

            <div class="col-xl-12 col-sm-2 items-center">
              <div class="col">
                <q-radio  v-model="test" val="Hot-flows"
                :label="$t('dashboard.newPainting.flows')"/>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="Galaxy"
                :label="$t('dashboard.newPainting.Galaxy')"/>
              </div>
              <div class="col">
                <q-radio  v-model="test" val="5000-Days"
                :label="$t('dashboard.newPainting.Days')"/>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 q-mb-lg items-center">
          <div class="q-col-md row justify-center items-center">
            <q-btn color="primary"
            class="q-px-xl" label="Genarate Painting"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class NewPainting extends Vue {
  private textType: string = '';
  private limit: number = 64;
  private empty: number = 0;
  private test: string = 'line';
  private slider: number = 0;
  private range: string = '';
  private hang: string = 'line';
  private icon: boolean = false;

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
.img{
  height: 429px;
  width: 230px;
  border:none;
}
.span-label{
  display: flex;
  align-items: center;
}
</style>
