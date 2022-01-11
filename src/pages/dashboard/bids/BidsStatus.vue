<template>
  <div class="row justify-center">
    <div v-if="curBidStatus === EnumBidStatusType.Winner" class="text-bold text-center q-my-md">
      {{ $t('dashboard.bid.youWon') }}
      <div class="box q-mb-md">
        {{ $t('dashboard.bid.congratulations') }}
      </div>
      <div class="row justify-center">
        <algo-button size="lg" color="primary" :label=" $t('dashboard.bid.claim')" @click="endAuction" />
      </div>
    </div>
    <div v-if="curBidStatus === EnumBidStatusType.Winning">
      <div class="text-bold text-positive flex justify-center">
        <div class="q-mr-sm">
          {{ $t('dashboard.bid.win') }}
        </div>
        <q-icon size="xs" name="mdi-check-circle" />
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        {{ $t('dashboard.bid.yourBid') }}
        <div class="row justify-center ">
          {{ bidCorreting(auctionItem.highestBid.netAmount) }}
          <div class="q-ml-sm">
            {{ auctionItem.highestBid.tokenSymbol }}
          </div>
        </div>
      </div>
      <div class="row justify-center">
        <algo-button size="lg" color="primary" :label="$t('dashboard.bid.bidAgain')" :to="`/auctions/${auctionItem._id}`" />
      </div>
    </div>
    <div v-if="curBidStatus === EnumBidStatusType.OutBidded">
      <div class="text-negative flex justify-center">
        <div class="text-bold q-mr-sm">
          {{ $t('dashboard.bid.outbid') }}
        </div>
        <q-icon size="xs" name="mdi-alpha-x-circle" />
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div class="q-my-md">
          {{ $t('dashboard.bid.yourLastBid') }}
          <div class="row justify-center">
            {{ bidCorreting(MyHighBid) }}
            <div class="q-ml-sm">
              {{ auctionItem.highestBid.tokenSymbol }}
            </div>
          </div>
        </div>
        <div class="col q-gutter-sm">
          <algo-button v-if="endedAuction == false" size="lg" color="primary" :label="$t('dashboard.bid.bidAgain')" :to="`/auctions/${auctionItem._id}`" />
          <div v-if="hasReturn">
            <algo-button size="lg" color="primary" :label="$t('dashboard.bid.removeBid',{amountRemove: amountToReturn})" class="remove" @click="claimBid" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="curBidStatus === EnumBidStatusType.EndedWithdraw">
      <div class="flex justify-center">
        <div class="text-negative text-bold q-mr-sm">
          {{ $t('dashboard.bid.auctionEnd') }}
        </div>
        <q-icon class="text-negative" size="xs" name="mdi-timer" />
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div class="q-my-md">
          {{ $t('dashboard.bid.yourLastBid') }}
          <div class="row justify-center">
            {{ amountToReturn }}
            <div class="q-ml-sm">
              {{ auctionItem.highestBid.tokenSymbol }}
            </div>
          </div>
        </div>
        <div class="col q-gutter-sm">
          <div v-if="hasReturn">
            <algo-button size="lg" color="primary" :label="$t('dashboard.bid.bidWithdraw',{amountRemove: amountToReturn})" class="remove" @click="claimBid" />
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="displayingStatus" persistent>
      <get-art-end-auction :end-auction-status="endAuctionStatus" @request-close="onCloseStatusDialog" />
    </q-dialog>
    <q-dialog v-model="displayingRemoveBid" persistent>
      <remove-bid :remove-bid-status="removeBidStatus" @request-close="onCloseStatusDialog" />
    </q-dialog>
    <q-dialog v-model="displayingClaimBid" persistent>
      <claim-bid :remove-bid-status="removeBidStatus" @request-close="onCloseStatusDialog" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { last } from 'ramda';

import { bidStatus, EnumBidStatus, IAuctionItem, isExpired } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import AlgoPainterAuctionSystemProxy, { EndAuctionStatus, RemoveBidStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import GetArtEndAuction from 'components/auctions/auction/GetArtEndAuction.vue';
import RemoveBid from 'components/auctions/auction/RemoveBid.vue';
import ClaimBid from 'components/auctions/auction/ClaimBid.vue';

class Props {
  auctionItem = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
    GetArtEndAuction,
    RemoveBid,
    ClaimBid,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
    }),
  },
})
export default class BidsStatus extends Vue.with(Props) {
  isMyBid: boolean = false;
  coinLastBid?: string;
  networkInfo!: NetworkInfo;
  userAccount!: string;
  auctionSystem!: AlgoPainterAuctionSystemProxy;

  displayingStatus: boolean = false;
  displayingRemoveBid: boolean = false;
  displayingClaimBid: boolean = false;
  myTotalBids: number = 0
  btnResult!: string;
  myBidsResult!: string;
  endAuctionStatus: EndAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;
  removeBidStatus: RemoveBidStatus = RemoveBidStatus.RemoveBidAwaitingInput;

  get EnumBidStatusType() : typeof EnumBidStatus {
    return EnumBidStatus;
  }

  get curBidStatus() : number {
    return bidStatus(this.auctionItem, this.userAccount);
  }

  get endedAuction() {
    return isExpired(this.auctionItem) || this.auctionItem.ended;
  }

  get auctionClaimed() {
    return this.auctionItem.ended;
  }

  getHighBid() {
    const highBid = this.auctionItem.highestBid.account;
    if (highBid === this.userAccount) {
      this.isMyBid = true;
    } else {
      this.isMyBid = false;
    }
  }

  get MyHighBid() {
    const getBids = this.auctionItem.bids;
    const account = this.userAccount;
    const myBidsFilter = getBids.filter(function(item) {
      return account === item.account;
    });
    const lastBid = last(myBidsFilter)?.netAmount;
    return lastBid as number;
  }

  get hasReturn() : boolean {
    return this.auctionItem.returns && this.auctionItem.returns[this.userAccount] > 0;
  }

  get amountToReturn() : string {
    return this.bidCorreting(this.auctionItem.returns[this.userAccount]);
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.auctionItem.minimumBid.tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  bidCorreting(bids: number) {
    const amount = blockchainToCurrency(
      bids,
      this.coinDetails.decimalPlaces,
    );
    return this.$n(amount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any);// eslint-disable-line @typescript-eslint/no-explicit-any
  }

  async endAuction() {
    if (!this.auctionItem) {
      return;
    }

    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    this.displayingStatus = true;
    this.endAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;

    await this.auctionSystem.endAuction(
      this.auctionItem.index,
      this.userAccount,
    ).on('error', () => {
      this.endAuctionStatus = EndAuctionStatus.EndAuctionError;
      this.$store.dispatch({
        type: 'auctions/getBids',
        account: this.userAccount,
        forBids: true,
      }).catch(console.error);
    }).on('transactionHash', () => {
      this.endAuctionStatus =
        EndAuctionStatus.EndAuctionAwaitingConfirmation;
    });

    this.endAuctionStatus = EndAuctionStatus.AuctionEnded;
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;
    this.displayingRemoveBid = false;
    this.displayingClaimBid = false;
  }

  async claimBid() {
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.displayingClaimBid = true;
    this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingInput;
    await this.auctionSystem.withdraw(
      this.auctionItem.index,
      this.userAccount,
    ).on('transactionHash', () => {
      this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingConfirmation;
      this.$store.dispatch({
        type: 'auctions/getBids',
        account: this.userAccount,
        forBids: true,
      }).catch(console.error);
    }).on('error', () => {
      this.removeBidStatus = RemoveBidStatus.RemoveBidError;
    });
    this.removeBidStatus = RemoveBidStatus.RemoveBid;
  }
}
</script>
<style scoped>
 .box{
    width: 250px;
  }
  .remove{
    width: 250px;
  }
</style>
