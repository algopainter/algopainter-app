<template>
  <div
    id="new-painting-top-info"
    class="row q-pb-lg"
  >
    <div class="batch-price">
      <p class="title">BATCH PRICE ($ALGOP)</p>
      <p class="amount">600</p>
    </div>
    <div class="remaining">
      <p class="title">REMAINING</p>
      <p class="amount">576</p>
    </div>
    <div class="minted">
      <p class="title">MINTED</p>
      <p class="amount">424</p>
    </div>
    <div class="tokens-to-burn">
      <p class="title">TOKENS TO BURN ($ALGOP)</p>
      <p class="amount">82,050</p>
    </div>
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
export default class NewPaintingTopInfo extends Vue {

}
</script>

<style lang="scss" scoped>
#new-painting-top-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  p{
    margin: 0px;
  }
  > div {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='DeepPink' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='round'/%3e%3c/svg%3e");
    padding: 12px 24px;
    min-width: 300px;
    text-align: center;
    font-weight: bold;
    .title {
      font-size: 16px;
      color: #A5A5A5;
    }
    .amount {
      color: $secondary;
      font-size: 60px;
    }
  }
  .batch-price,
  .remaining,
  .minted {
    margin-right: min(15px);
  }
}

@media(max-width: 1385px) {
  #new-painting-top-info {
    > div {
      min-width: 220px;
    }
  }
}

@media(max-width: 1024px) {
  #new-painting-top-info {
    > div {
      min-width: 160px;
    }
  }
}

@media(max-width: 768px) {
  #new-painting-top-info {
  > div {
    min-width: 150px;
    .title {
      font-size: 10px;
    }
    .amount {
      font-size: 40px;
    }
  }
    .batch-price,
    .remaining,
    .minted {
      margin-right: min(10px);
    }
  }
}

@media(max-width: 541px) {
  #new-painting-top-info {
    > div {
      padding: 8px 8px 0px 8px;
      min-width: 90px !important;
    }
    .batch-price,
    .minted,
    .remaining {
      margin-right: min(0px);
    }
    .tokens-to-burn,
    .minted {
      margin-top: 5px;
    }
  }
}

@media(max-width: 480px) {
  #new-painting-top-info {
    > div {
      padding: 8px 16px 0px 16px;
      width: 187px;
    }
  }
}

@media(max-width: 375px) {
  #new-painting-top-info {
    > div {
      width: 168px;
    }
  }
}

@media(max-width: 360px) {
  #new-painting-top-info {
    > div {
      width: 160px;
      .amount {
        font-size: 35px;
      }
    }
  }
}

@media(max-width: 320px) {
  #new-painting-top-info {
    justify-content: center;
    > div {
      .amount {
        font-size: 30px;
      }
    }
    .remaining {
      margin-top: 5px;
    }
  }
}
</style>