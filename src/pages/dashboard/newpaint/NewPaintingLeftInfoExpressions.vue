<template>
  <div class="title">
    {{ $t('dashboard.newPainting.parameters') }}
  </div>
  <q-select
    v-model="NewArtFields.fieldA"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelA })"
    class="full-width"
  />
  <q-select
    v-model="NewArtFields.fieldB"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelB })"
  />
  <q-select
    v-model="NewArtFields.fieldC"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelC })"
  />
  <q-select
    v-model="NewArtFields.fieldD"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelD })"
  />
  <q-radio
    v-model="NewArtFields.fieldE"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelE })"
    class="full-width q-pt-sm"
    :val="true"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelF }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldF"
      :min="0"
      :max="50"
    />
  </div>
  <q-radio
    v-model="NewArtFields.fieldG"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelG })"
    class="full-width q-pt-sm"
    :val="true"
  />
  <q-select
    v-model="NewArtFields.fieldH"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelH })"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldI"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelI })"
      :min="0"
      :max="50"
    />
  </div>
  <q-select
    v-model="NewArtFields.fieldJ"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelJ })"
  />
  <div class="algo-slider">
    <p class="label">{{ $t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK }) }}</p>
    <q-slider
      v-model="NewArtFields.fieldK"
      :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelK })"
      :min="0"
      :max="50"
    />
  </div>
  <q-radio
    v-model="NewArtFields.fieldL"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelL })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <q-radio
    v-model="NewArtFields.fieldM"
    :label="$t('dashboard.newPainting.fieldLabel', { label: newArtLabels.labelM })"
    class="full-width q-pt-sm"
    :val="false"
  />
  <algo-button
    :label="$t('dashboard.newPainting.leftInfoBtnName')"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? 'full-width q-mt-lg q-mb-lg' : 'full-width q-mt-lg']"
    color="primary"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AlgoSlider from 'components/common/AlgoSlider.vue';
import AlgoButton from 'components/common/Button.vue';

interface INewPainting {
  labelA?: string,
  labelB?: string,
  labelC?: string,
  labelD?: string,
  labelE?: string,
  labelF?: string,
  labelG?: string,
  labelH?: string,
  labelI?: string,
  labelJ?: string,
  labelK?: string,
  labelL?: string,
  labelM?: string,
}

@Options({
  components: {
    AlgoSlider,
    AlgoButton, 
  },
})
export default class NewPaintingLeftInfo extends Vue {
  newArtLabels: INewPainting = {
    labelA: 'Background',
    labelB: 'Biological Sex',
    labelC: 'Expression',
    labelD: 'Skin',
    labelE: 'Use Wireframe',
    labelF: 'Wireframe Hue',
    labelG: 'Use Wireframe Blend',
    labelH: 'Wireframe Blend Style',
    labelI: 'Innercolor Hue',
    labelJ: 'Magic',
    labelK: 'Overlay Hue',
    labelL: 'Use Shadow',
    labelM: 'Flip',
  }

  NewArtFields = {
    fieldA: 'Bitcoin',
    fieldB: 'Female',
    fieldC: 'Angry',
    fieldD: 'SpaceCode',
    fieldE: true,
    fieldF: 0,
    fieldG: true,
    fieldH: 'Add',
    fieldI: 0,
    fieldJ: 'Fractal Perception',
    fieldK: 0,
    fieldL: false,
    fieldM: false,
  }

  /*
    const getBase64FromUrl = async (url: string) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
          const base64data = reader.result;   
          resolve(base64data);
        }
      });
    }

    const base64 = await getBase64FromUrl(url)

    console.log('base64', base64);
    console.log('base64.data', base64);

    const payload = {
      ...this.artBasicInfo,
      mintedBy: this.account,
      base64,
    }
  */
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.6);
  }
  .algo-slider {
    .label {
      position: relative;
      top: 10px;
      margin: 0px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
    }
  }
</style>