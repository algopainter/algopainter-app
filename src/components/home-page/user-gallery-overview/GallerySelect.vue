<template>
  <div class="row q-mb-md">
    <div class="col-12 col-md-3 col-lg-3">
      <q-img
        class="previewImage"
        :src="art.item.previewImage"
        alt="img art"
      />
    </div>
    <div class="col-12 col-md-4 col-lg-4">
      <div class="text">
        <div class="text text-bold text-h6">
          {{ $t('dashboard.homePage.symbol') }}{{ art.item.index }} {{ art.item.title }}
        </div>
        {{ art.item.description }}
      </div>
      <div>
        <div class="text-bold text-h4 q-mt-md">
          {{ "Last Bids" }}
        </div>
        <p class="coin text-h6">
          {{ $t('dashboard.sellYourArt.ireceive') }} {{ "WETH" }}
        </p>
      </div>
      <div class="text-bold text-h6">
        <p class="won-bid">
          {{ 'You Won' }}
        </p>
        <p>
          {{ 'Auction ended' }}
        </p>
      </div>
    </div>
    <div class="col-12 col-md-3 col-lg-3 items-center">
      <div>
        <span class=" text-bold">
          {{ $t('dashboard.homePage.earned') }}
        </span>
        <div class="flex container">
          <q-input
            v-model="coinHavest"
            fill-mask="0"
            input-class="text-left"
            class="input-stack-algop"
          />
          <algo-button
            :label="$t('dashboard.homePage.havest')"
            color="primary"
            class="btn-havest"
          />
        </div>
        <span>{{ $t('dashboard.homePage.stakedAlgop') }}</span>
        <div class="flex container">
          <q-input
            v-model="coinHavest"
            fill-mask="0"
            input-class="text-left"
            class="input-stack-algop"
          />
          <algo-button
            label="-"
            color="primary"
            class="btn-staked"
            @click="unstackCoin()"
          />
          <algo-button
            label="+"
            color="primary"
            class="btn-staked"
            @click="stackCoin()"
          />
          <stack-modal-algop v-model="openModal" />
          <UnstackModalAlgop v-model="openModalUnstack" />
        </div>
        <div class="text-primary q-my-sm">
          {{ 'You can withdraw 0.002 WETH de BIDBACK' }}
        </div>
      </div>
    </div>
    <div class="col-12 col-md-2 col-lg-2">
      <div
        class="bidBack text-white column justify-center content-center q-mb-xl"
      >
        <div class="row justify-center items-center content-center">
          {{ "10%" }}
        </div>
        <div class="row justify-center items-center content-center">
          {{ "BidBack" }}
        </div>
      </div>
      <algo-button
        :label="$t('dashboard.auctions.bidbackBtn')"
        color="primary"
        outline
        class="load-more q-px-xl q-mx-auto"
        @click="openBidBackModal()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import StackModalAlgop from 'src/components/modal/StackModalAlgop.vue';
import UnstackModalAlgop from 'src/components/modal/UnstackModalAlgop.vue';
import { IAuctionItem } from 'src/models/IAuctionItem';
class Props {
  art = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  btnName = prop({
    type: String,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton, StackModalAlgop, UnstackModalAlgop,
  },
})

export default class gallerySelect extends Vue.with(Props) {
  canStack: boolean = false;
  coinHavest: number = 0;
  openModal: boolean = false;
  openModalUnstack: boolean = false;

  stackAlgo() {
    this.canStack = true;
  }

  stackCoin() {
    this.openModal = true;
  }

  unstackCoin() {
    this.openModalUnstack = true;
  }

  openBidBackModal() {
    void this.$store.dispatch({
      type: 'auctions/openBidBackModal',
      auctionId: this.art._id,
    });
  }
}

</script>

<style scoped lang="scss">
.text{
  white-space: nowrap;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.won-bid{
  color: $positive;
}

.btn-staked{
  min-width: 30px;
  margin-right: 10px;
  height: 30px;
  margin-top: 20px;
}

.btn-havest{
  min-width: 100px;
  height: 50px;
  margin-top: 10px;
}

.previewImage{
  width: 290px;
}
.input-stack-algop{
  width:170px;
  margin-right: 10px;
}
.container{
  width: 300px;
}
.bidBack{
  text-align: unset;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: $primary;
}
.coin{
  color: $primary;
}
</style>
