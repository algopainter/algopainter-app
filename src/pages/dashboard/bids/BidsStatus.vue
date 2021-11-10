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
          :label=" $t('dashboard.bid.claim')"
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
            {{ bidCorreting(bidsAuctions.highestBid.netAmount) }}
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
          :label="$t('dashboard.bid.bidAgain')"
          :to="`/auctions/${bidsAuctions._id}`"
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
        <div
          v-if="myBidsResult !== undefined"
          class="q-my-md"
        >
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
        <div v-else>
          {{ $t('dashboard.bid.yourLastBid') }}
          <div class="row justify-center">
            <div>
              {{ bidCorreting(MyHighBid) }}
            </div>
            {{ myBidsResult }}
            <div class="q-ml-sm">
              {{ bidsAuctions.highestBid.tokenSymbol }}
            </div>
          </div>
        </div>
        <div class="col q-gutter-sm">
          <div>
            <algo-button
              size="lg"
              color="primary"
              :label="$t('dashboard.bid.bidAgain')"
              :to="`/auctions/${bidsAuctions._id}`"
            />
          </div>
          <div v-if="myBidsResult !== undefined">
            <algo-button
              size="lg"
              color="primary"
              :label="myBids"
              @click="claimBid"
            />
          </div>
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
          @click="withdraw"
        />
      </div>
    </div>
    <q-dialog
      v-model="displayingStatus"
      persistent
    >
      <get-art-end-auction
        :end-auction-status="endAuctionStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
    <q-dialog
      v-model="displayingRemoveBid"
      persistent
    >
      <remove-bid
        :remove-bid-status="removeBidStatus"
        @request-close="onCloseStatusDialog"
      />
    </q-dialog>
    <q-dialog
      v-model="displayingClaimBid"
      persistent
    >
      <claim-bid
        :remove-bid-status="removeBidStatus"
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
import AlgoPainterAuctionSystemProxy, { EndAuctionStatus, RemoveBidStatus } from 'src/eth/AlgoPainterAuctionSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import GetArtEndAuction from 'components/auctions/auction/GetArtEndAuction.vue';
import RemoveBid from 'components/auctions/auction/RemoveBid.vue';
import ClaimBid from 'components/auctions/auction/ClaimBid.vue';

class Props {
  bidsAuctions= prop({
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

  beforeMount() {
    void this.myBids;
  }

  get accountAdress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

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
  }

  get MyHighBid() {
    const getBids = this.bidsAuctions.bids;
    const account = this.userAccount;
    const myBidsFilter = getBids.filter(function(item) {
      return account === item.account;
    });
    const lastBid = last(myBidsFilter)?.netAmount;
    return lastBid as number;
  }

  get myBids() {
    try {
      const getBids = this.bidsAuctions.returns;
      const account = this.userAccount;
      const getBidsKeys = Object.keys(getBids);
      getBidsKeys.forEach((key) => {
        if (key === account) {
          const BidsKey = getBids[key as unknown as number] as unknown as number;
          this.myBidsResult = this.bidCorreting(BidsKey);
          const coin = this.bidsAuctions.bids[0].tokenSymbol;
          this.btnResult = this.$t('Claim: ' + this.myBidsResult + ' ' + coin);
        }
      });
    } catch (error) {
    }

    return this.btnResult;
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
    if (!this.bidsAuctions) {
      return;
    }

    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    this.displayingStatus = true;
    this.endAuctionStatus = EndAuctionStatus.EndAuctionAwaitingInput;

    await this.auctionSystem.endAuction(
      this.bidsAuctions.index,
      this.accountAdress,
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
    this.displayingRemoveBid = false;
    this.displayingClaimBid = false;
  }

  async withdraw() {
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.displayingRemoveBid = true;
    this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingInput;
    await this.auctionSystem.withdraw(
      this.bidsAuctions.index,
      this.accountAdress,
    ).on('transactionHash', () => {
      this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingConfirmation;
    }).on('error', () => {
      this.removeBidStatus = RemoveBidStatus.RemoveBidError;
    });
    this.removeBidStatus = RemoveBidStatus.RemoveBid;
    // void withdrawBid.withdraw(this.bidsAuctions.index, this.accountAdress);
  }

  async claimBid() {
    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.displayingClaimBid = true;
    this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingInput;
    await this.auctionSystem.withdraw(
      this.bidsAuctions.index,
      this.accountAdress,
    ).on('transactionHash', () => {
      this.removeBidStatus = RemoveBidStatus.RemoveBidAwaitingConfirmation;
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
</style>
