<template>
  <q-card class="row justify-between container-bids" bordered>
    <div class="col-xs-12 col-sm-12 col-md-7">
      <BidsInfor :bids-auctions="bid" :index="index" />
    </div>
    <q-separator vertical inset />
    <div class="col-xs-12 col-sm-12 col-md-4 row items-center justify-center box">
      <BidsStatus :auction-item="bid" />
    </div>
  </q-card>
</template>

<script lang="ts">

import { PropType } from 'vue';
import { Options, Vue, prop } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import BidsStatus from './BidsStatus.vue';
import BidsInfor from './BidsInfor.vue';
import { IAuctionItem } from 'src/models/IAuctionItem';

class Props {
  bid = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  index= prop({
    type: Number,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
    BidsStatus,
    BidsInfor,
  },
})

export default class BidsPage extends Vue.with(Props) {
}
</script>

<style lang="scss">
.container-bids{
  padding: 20px;
  margin: 10px;
}

.box{
  width: 100%;
}
</style>
