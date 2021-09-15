<template>
  <q-dialog
    ref="dialogRef"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card class="place-bid-card">
      <q-card-section class="header">
        {{ $t('dashboard.auctionPage.placeABid') }}
      </q-card-section>
      <q-card-section>
        <q-form>
          <div>
            <q-input
              v-model="bidValue"
              :label="$t('dashboard.auctionPage.amount')"
              type="number"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="flex">
        <q-space />
        <div>
          <algo-button
            color="primary"
            :label="$t('dashboard.auctionPage.placeABid')"
            :loading="placingBid"
            @click="placeBid"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref, Prop } from 'vue-property-decorator';
import { QDialog } from 'quasar';
import { mapGetters } from 'vuex';

import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
    }),
  },
})
export default class NewBidDialog extends Vue {
  @Ref() dialogRef!: QDialog;
  @Prop() auction!: IAuctionItem;

  auctionSystem!: AlgoPainterAuctionSystemProxy;
  algopToken!: AlgoPainterTokenProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  bidValue: string = '';
  placingBid: boolean = false;

  get persistent() {
    return this.placingBid;
  }

  get auctionSystemContractAddress() {
    return getAuctionSystemContractByNetworkId(this.networkInfo.id);
  }

  mounted() {
    this.show();
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.algopToken = new AlgoPainterTokenProxy(this.networkInfo);
  }

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  onDialogHide() {
    this.$emit('hide');
  }

  async approveContractTransfer() {
    const allowance = await this.algopToken
      .allowance(this.userAccount, this.auctionSystemContractAddress);

    console.log({ allowance: Number(allowance) });

    if (Number(allowance) === 0) {
      await this.algopToken.approve(
        this.auctionSystemContractAddress,
        100000000,
        // Number.MAX_SAFE_INTEGER,
        this.userAccount,
      );
    }
  }

  async placeBid() {
    try {
      this.placingBid = true;

      await this.approveContractTransfer();

      await this.auctionSystem.bid(
        this.auction.index,
        Number(this.bidValue),
        this.userAccount,
      );

      console.log({
        index: this.auction.index,
        bidValue: Number(this.bidValue),
        userAccount: this.userAccount,
      });

      this.placingBid = false;
    } catch (error) {
      console.log(error);
      this.placingBid = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.place-bid-card {
  width: 600px;

  .header {
    background: $primary;
    font-size: 1.4rem;
    color: #FFF;
  }
}
</style>
