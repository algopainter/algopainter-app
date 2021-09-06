<template>
  <div class="row">
    <div class="col-12 col-md-6 col-lg-6">
      <q-img
        class="previewImage"
        :src="art.nft.previewImage"
        alt="img art"
      />
    </div>
    <div class="col-12 col-md-6 col-lg-6 q-gutter-xl">
      <div class="text">
        <p class="text text-bold text-h6">
          {{ $t('dashboard.homePage.symbol') }}{{ art.nft.index }} {{ art.title }}
        </p>
        {{ art.nft.parameters.description }}
      </div>
      <div v-if="select === 4">
        <div v-if="canStack === false">
          <div class="coin text-h6">
            {{ $t('dashboard.homePage.algop') }}{{ $t('dashboard.sellYourArt.ireceive') }}
          </div>
          <div>
            <algo-button
              :label="$t('dashboard.homePage.stakeAlgo')"
              color="primary"
              @click="stackAlgo()"
            />
          </div>
        </div>
        <div v-else>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import { IMyGallery } from 'src/models/IMyGallery';
import AlgoButton from 'components/common/Button.vue';
import StackModalAlgop from 'src/components/modal/StackModalAlgop.vue';
import UnstackModalAlgop from 'src/components/modal/UnstackModalAlgop.vue';
class Props {
  art = prop({
    type: Object as PropType<IMyGallery>,
    required: true,
  })

  select = prop({
    type: Number,
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
}

</script>

<style scoped>
.text{
  white-space: nowrap;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-staked{
  min-width: 30px;
  margin-right: 10px;
  height: 50px;
  margin-top: 10px;
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

.coin{
  color: #00B412;
}
</style>
