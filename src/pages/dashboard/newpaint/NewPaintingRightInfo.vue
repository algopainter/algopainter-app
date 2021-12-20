<template>
  <div class="img-container">
    <q-img
      src="../../../assets/images/manwithnoname.jpeg"
      class="img"
    />
  </div>
  <div class="content">
    <q-input
      :label="$t('dashboard.newPainting.artName')"
      maxlength="64"
      counter
    />
    <q-input
      :label="$t('dashboard.newPainting.artDescription')"
      maxlength="64"
      counter
    />
    <q-radio
      v-model="isAwareOfFee"
      :label="$t('dashboard.newPainting.artMintingFee', {feeAmount: feeAmount, feePercentage: feePercentage})"
      class="full-width q-pt-lg"
      :val="true"
    />
    <algo-button
      :label="$t('dashboard.newPainting.rightInfoBtnName')"
      class="full-width q-mt-lg"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})
export default class NewPaintingRightInfo extends Vue {
  isAwareOfFee = false;
  feeAmount = '0.1025';
  feePercentage =  2.5;
}
</script>

<style lang="scss" scoped>
  .img-container {
    display: flex;
    justify-content: center;
    padding: 40px;
    align-items: center;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='DeepPink' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='round'/%3e%3c/svg%3e");
      .img {
        width: 80%;
        height: 80%;
      }
  }
</style>