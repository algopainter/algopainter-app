<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide"
  >
    <q-card class="q-pa-md">
      <p class="text-bold text-h6">
        {{ $t('dashboard.unstackModalAlgop.title') }}
      </p>
      <div>
        <div>
          <div class="row justify-between">
            <div class="flex items-end q-pb-sm text-bold">
              {{ $t('dashboard.unstackModalAlgop.unstake') }}
            </div>
            <div>
              <div class="variable-balance text-bold">
                {{ $t('dashboard.unstackModalAlgop.balance') }}
              </div>
              <div class="q-pb-sm">
                {{ formattedBalance }}
              </div>
            </div>
          </div>
          <q-input
            v-model="unstakeAmount"
            class="q-mb-sm"
            type="number"
            rounded
            outlined
            suffix="$ALGOP"
            :rules="[val => !!val || $t('dashboard.unstackModalAlgop.noAlgop')]"
            no-error-icon="false"
            :bind="validateInput()"
          >
            <template #append>
              <q-btn
                rounded
                color="primary"
                @click="maxStakeAmount"
              >
                {{ $t('dashboard.unstackModalAlgop.max') }}
              </q-btn>
            </template>
          </q-input>
          <p
            v-if="isConfirmBtnLoading"
            class="q-mb-lg"
          >
            <q-icon
              name="mdi-alert-circle"
              color="yellow"
              size="md"
            /> {{ $t('dashboard.stackModalAlgop.interact') }}
          </p>
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              color="primary"
              class=""
              :label="$t('dashboard.unstackModalAlgop.cancel')"
            />
            <algo-button
              type="submit"
              color="primary"
              :label="$t('dashboard.unstackModalAlgop.confirm')"
              :disabled="isDisabled"
              :loading="isConfirmBtnLoading"
              @click="unstakeAlgop"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import AlgoButton from 'components/common/Button.vue';
import { QDialog, Notify } from 'quasar';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import getAlgoPainterContractByNetworkId, { getRewardsSystemContractByNetworkId } from 'src/eth/Config';
import { numberToString } from 'src/helpers/format/numberToString';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import UserUtils from 'src/helpers/user';

enum PlacingBidbackStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  PlaceBidbackAwaitingInput,
  PlaceBidbackAwaitingConfirmation,
  PlaceBidbackError,
  BidbackCreated,
}

class Props {
  algopStack= prop({
    type: Number,
    required: true,
  })

  art = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters(
      'user', [
        'networkInfo',
        'account',
        'isConnected',
      ]),
  },
})
export default class MyPaint extends Vue.with(Props) {
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  auctionSystemProxy!: AlgoPainterAuctionSystemProxy;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  modal: boolean = true;
  isDisabled: boolean = true;
  unstakeAmount: number | null | string = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;
  formattedBalance: string = '';
  placingBidbackStatus: PlacingBidbackStatus | null = null;

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    this.$refs.dialog.hide();
  }

  onDialogHide() {
    this.$emit('hide');
  }

  closeModal() {
    this.modal = false;
  }

  declare $refs: {
    dialog: QDialog;
  };

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
      void this.setformattedBalance();
    }
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.balance, 2);
  }

  async maxStakeAmount() {
    try {
      this.unstakeAmount = await this.rewardsSystem.getTotalBidbackStakes(this.art.index);
    } catch (error) {
      console.log('error maxStakeAmount');
    }
  }

  validateInput() {
    this.unstakeAmount = Number(this.unstakeAmount);
    if (this.unstakeAmount <= 0 || this.unstakeAmount === null) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  @Watch('balance')
  onBalanceChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
  }

  mounted() {
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    this.auctionSystemProxy = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
    void this.setAccountBalance();
  }

  get auctionRewardsContractAddress() {
    return getRewardsSystemContractByNetworkId(this.networkInfo.id);
  }

  get algoPainterContractByNetworkId() {
    return getAlgoPainterContractByNetworkId(this.networkInfo.id) as string;
  }

  get coinDetails() {
    const coin = auctionCoins.find((coin) => {
      const { tokenPriceAddress } = this.art.minimumBid;

      return coin.tokenAddress.toLowerCase() === tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  async unstakeAlgop() {
    this.isConfirmBtnLoading = true;

    const { decimalPlaces } = this.coinDetails;

    const unstakeAmount = currencyToBlockchain(
      Number(this.unstakeAmount),
      decimalPlaces,
    );

    await this.approveContractTransfer(unstakeAmount);

    try {
      if (this.unstakeAmount && typeof this.unstakeAmount === 'number') {
        await this.rewardsSystem.unstakeBidback(this.art.index, this.unstakeAmount, this.account).on('transactionHash', () => {
          Notify.create({
            message: 'Algop unstaked successfully',
            color: 'green',
            icon: 'mdi-check',
          });
        }).on('error', () => {
          Notify.create({
            message: 'It was not possible to unstake',
            color: 'red',
            icon: 'mdi-alert',
          });
          // this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionError;
        });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('error.code', error.code);
    }

    this.isConfirmBtnLoading = false;
  }

  async approveContractTransfer(amount: number) {
    this.placingBidbackStatus = PlacingBidbackStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy
      .allowance(this.account, this.auctionRewardsContractAddress);

    if (allowance < amount) {
      this.placingBidbackStatus = PlacingBidbackStatus.IncreateAllowanceAwaitingInput;

      const { decimalPlaces } = this.coinDetails;

      const allowanceAmount = currencyToBlockchain(
        Number.MAX_SAFE_INTEGER,
        decimalPlaces,
      );

      await this.auctionCoinTokenProxy.approve(
        this.auctionRewardsContractAddress,
        numberToString(allowanceAmount),
        this.account,
      ).on('error', () => {
        this.placingBidbackStatus = PlacingBidbackStatus.IncreateAllowanceError;
      }).on('transactionHash', () => {
        this.placingBidbackStatus =
          PlacingBidbackStatus.IncreateAllowanceAwaitingConfirmation;
      });
    }
  }
}
</script>
<style scoped>
.margin{
  margin: 0px auto;
}
.inputAl{
 width: 90%;
}
.variable-balance{
  width: 30%;
}
</style>
