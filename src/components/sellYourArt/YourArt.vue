<template>
  <q-page class="col">
    <div class="header ">
      {{ $t('dashboard.youArt.title') }}
    </div>
    <div class="container col justify-center ">
      <div class="q-pa-xl">
        <q-img
          src="~assets/placeholder-images/painting.jpg"
          class="img"
        />
        <div class="header q-pt-md">
          {{ $t('dashboard.youArt.abstractName') }}
        </div>
        <p>
          {{ $t('dashboard.youArt.of') }}
        </p>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';

export default class YourArt extends Vue {

}

</script>

<style lang="scss" scoped>
.img{
    width: 100%;
    max-width: 300px;
    max-height: 300px;
    border-radius: 3%;
}
.container{
    border: 2px dashed #F4538D;
    width: 100%;
    max-width: 400px;
    max-height: 450px;
}
</style>
