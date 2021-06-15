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
        {{ $t('dashboard.newPainting.Create') }}
      </div>

      <div class="q-mt-lg">
        <label>{{ $t('dashboard.newPainting.TypeAText') }}</label>
        <q-input v-model="TextType" v-bind:maxlength="LetterLimit"/>
        <p class="justify-end text-right">
          {{TypedLetters}}{{ $t('dashboard.newPainting.Trace') }}{{RestLetter}}
        </p>
        <div class="col-xs-6 col-sm-3 ">
          <span>{{ $t('dashboard.newPainting.PaintOnWall') }}</span>
          <div class="row">
              <q-radio  v-model="RadioPaint" val="Yes"
                :label="$t('dashboard.newPainting.YesLabel')"/>
              <q-radio  v-model="RadioPaint" val="No"
              :label="$t('dashboard.newPainting.NoLabel')"/>
          </div>
        </div>

        <div>
          <span>{{ $t('dashboard.newPainting.CoresAleatórias') }}</span>
          <div class="row">
              <q-radio v-model="RadioCores" val="yes"
                :label="$t('dashboard.newPainting.YesLabel')"/>
              <q-radio v-model="RadioCores" val="no"
                :label="$t('dashboard.newPainting.NoLabel')"/>
          </div>
          <div v-if="RadioCores==='yes'" class="q-mt-md" >
            <p>{{ $t('dashboard.newPainting.CollorInversionProbability') }}</p>
            <q-slider v-model="InversionProbability"
            color="primary" :min="0" :max="50"/>
          </div>
        </div>

        <div class="q-mt-md">
          <p>{{ $t('dashboard.newPainting.YourInspiration') }}</p>
          <div class="row">
            <div class="col-xs-12 col-sm-6 items-center">
              <div class="col">
                <q-radio  v-model="RadioInspiration" val="Random"
                :label="$t('dashboard.newPainting.Random')"/>
              </div>
              <div class="col">
                <q-radio  v-model="RadioInspiration" val="Calm"
                :label="$t('dashboard.newPainting.Calm')"/>
              </div>
              <div class="col">
                <q-radio  v-model="RadioInspiration"
                val="Colorfull-blocks"
                :label="$t('dashboard.newPainting.Colorfull')"/>
              </div>
              <div class="col">
                <q-radio  v-model="RadioInspiration"
                val="Colorfull-paths"
                :label="$t('dashboard.newPainting.Paths')"/>
              </div>
            </div>

            <div class="col-xl-12 col-sm-2 items-center">
              <div class="col">
                <q-radio  v-model="RadioInspiration" val="Hot-flows"
                :label="$t('dashboard.newPainting.Flows')"/>
              </div>
              <div class="col">
                <q-radio  v-model="RadioInspiration" val="Galaxy"
                :label="$t('dashboard.newPainting.Galaxy')"/>
              </div>
              <div class="col">
                <q-radio  v-model="RadioInspiration" val="5000-Days"
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
  private TextType: string = '';
  private LetterLimit: number = 64;
  private EmptySpace: number = 0;
  private RadioInspiration: string = 'line';
  private InversionProbability: number = 0;
  private RadioCores: string = '';
  private RadioPaint: string = 'line';

  get RestLetter (): number {
    return this.LetterLimit - this.TextType.length;
  }

  get TypedLetters (): number {
    return this.EmptySpace + this.TextType.length;
  }
}
</script>

<style scoped>
.typeText {

  border: none;

  border-bottom: 1px solid black;

}
.typeText:focus {

  border-top: none;

}
.img {

  height: 429px;

  width: 230px;

  border:none;

}
.span-label {

  display: flex;

  align-items: center;

}
</style>
