<template>
  <div
    class="row justify-center"
  >
    <div
      v-if="endedAuction === true && isMyBid === true"
      class="text-bold text-center q-my-md"
    >
      <div>
        {{ $t('dashboard.bid.youWon') }}
      </div>
      <div class="box q-mb-md">
        {{ $t('dashboard.bid.congratulations') }}
      </div>
      <div class="row justify-center">
        <algo-button
          size="lg"
          color="primary"
          :label=" $t('dashboard.bid.clain')"
          @click="endAuction"
        />
      </div>
    </div>
    <div
      v-else-if="endedAuction === false && isMyBid === true"
    >
      <div
        class="text-bold text-positive flex justify-center"
      >
        <div class="q-mr-sm">
          {{ $t('dashboard.bid.win') }}
        </div>
        <div>
          <q-icon
            size="xs"
            name="mdi-check-circle"
          />
        </div>
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div>
          {{ $t('dashboard.bid.yourBid') }}
        </div>
        <div class="row justify-center ">
          <div>
            {{ bidCorreting(bidsAuctions.highestBid.amount) }}
          </div>
          <div class="q-ml-sm">
            {{ bidsAuctions.highestBid.tokenSymbol }}
          </div>
        </div>
      </div>
      <div class="row justify-center">
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.viewArt')"
          :to="`/collections/${bidsAuctions.item._id}`"
        />
      </div>
    </div>
    <div
      v-else-if="endedAuction === false && isMyBid === false"
    >
      <div
        class="text-negative flex justify-center"
      >
        <div class="text-bold q-mr-sm">
          {{ $t('dashboard.bid.outbid') }}
        </div>
        <q-icon
          size="xs"
          name="mdi-alpha-x-circle"
        />
      </div>
      <div class="text-h6 text-bold text-center justify-center q-my-md">
        <div class="q-my-md">
          {{ $t('dashboard.bid.yourBid') }}
          <div class="row justify-center">
            <div>
              {{ bidCorreting(MyHighBid) }}
            </div>
            <div class="q-ml-sm">
              {{ bidsAuctions.highestBid.tokenSymbol }}
            </div>
          </div>
        </div>
        <div>
          <algo-button
            size="lg"
            color="primary"
            :label="$t('dashboard.bid.bidAgain')"
            :to="`/auctions/${bidsAuctions._id}`"
          />
        </div>
      </div>
    </div>
    <div
      v-else-if="endedAuction === true && isMyBid === false"
    >
      <div class="row text-h6 text-bold text-center justify-center q-my-md">
        <div>
          {{ $t('dashboard.bid.yourBid') }}
          <div class="row justify-center q-my-md text-bold">
            <div>
              {{ bidCorreting(MyHighBid) }}
            </div>
            <div class="q-ml-sm ">
              {{ bidsAuctions.highestBid.tokenSymbol }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.removeBid')"
        />
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <end-auction-status-card
        :end-auction-status="endAuctionStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, prop, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { last } from 'ramda';
import moment from 'moment';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';
import AlgoPainterAuctionSystemProxy, { EndAuctionStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import EndAuctionStatusCard from 'components/auctions/auction/EndAuctionStatusCard.vue';

class Props {
  bidsAuctions= prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
    EndAuctionStatusCard,
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
  endAuctionStatus: EndAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;

  get endedAuction() {
    const dataEndedAuction = this.bidsAuctions.expirationDt;
    const momentApi = moment(dataEndedAuction).format('X') as unknown as number;
    const momentToday = moment().format('X') as unknown as number;

    this.getHighBid();

    if (momentApi <= momentToday) {
      return true;
    } else {
      return false;
    }
  }

  getHighBid() {
    const highBid = this.bidsAuctions.highestBid.account;
    if (highBid === this.userAccount) {
      this.isMyBid = true;
    } else {
      this.isMyBid = false;
    }
    // console.log(this.bidsAuctions);
  }

  get MyHighBid() {
    // buscar os bids
    const getBids = this.bidsAuctions.bids;
    // console.log('getBids', getBids);
    const account = this.userAccount;
    // filtrar os bids comparando com a account do usuario
    const myBidsFilter = getBids.filter(function(item) {
      return account === item.account;
    });
    // selecionar o ultimo lançe do usuario.
    const lastBid = last(myBidsFilter)?.amount;
    return lastBid as number;
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      return coin.tokenAddress.toLowerCase() === this.bidsAuctions.minimumBid.tokenPriceAddress;
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
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    this.displayingStatus = true;
    this.endAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;

    await this.auctionSystem.endAuction(
      this.bidsAuctions.index,
      this.userAccount,
    ).on('error', () => {
      this.endAuctionStatus = EndAuctionStatus.EndAuctionError;
    }).on('transactionHash', () => {
      this.endAuctionStatus =
        EndAuctionStatus.EndAuctionAwaitingConfirmation;
    });

    this.endAuctionStatus = EndAuctionStatus.AuctionEnded;
  }

  onCloseStatusDialog() {
    this.displayingStatus = false;
  }
}
</script>
<style scoped>
 .box{
    width: 250px;
  }
</style>
