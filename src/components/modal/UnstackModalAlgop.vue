<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    persistent
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
            :rules="[
              (val) => !!val || $t('dashboard.unstackModalAlgop.noAlgop'),
            ]"
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
            v-if="
              placingBidBackStatus === PlacingBidBackStatus.CheckingAllowance
            "
            class="q-mb-lg"
          >
            <q-icon
              name="mdi-alert-circle"
              color="yellow"
              size="md"
            />
            {{ $t('dashboard.unstackModalAlgop.interact') }}
          </p>
          <p
            v-else-if="
              placingBidBackStatus ===
                PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation
            "
          >
            <q-icon
              name="mdi-alert"
              color="yellow"
              size="md"
            />{{
              $t('dashboard.unstackModalAlgop.confirmWallet')
            }}
          </p>
          <p
            v-else-if="
              placingBidBackStatus ===
                PlacingBidBackStatus.IncreateAllowanceError
            "
          >
            <q-icon
              name="mdi-alert-circle"
              color="red"
              size="md"
            />{{
              $t('dashboard.unstackModalAlgop.error')
            }}
          </p>
          <p
            v-else-if="
              placingBidBackStatus ===
                PlacingBidBackStatus.IncreateAllowanceCompleted
            "
          >
            <q-icon
              name="mdi-check"
              color="green"
              size="md"
            />
            {{ $t('dashboard.unstackModalAlgop.stakeSucess') }}
          </p>
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              :disabled="isCancelDisabled"
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
import { QDialog } from 'quasar';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import getAlgoPainterContractByNetworkId, {
  getRewardsSystemContractByNetworkId,
} from 'src/eth/Config';
import { numberToString } from 'src/helpers/format/numberToString';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import UserUtils from 'src/helpers/user';
import { blockchainToCurrency } from 'src/helpers/format/blockchainToCurrency';

enum PlacingBidBackStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  PlaceBidBackAwaitingInput,
  PlaceBidBackAwaitingConfirmation,
  PlaceBidBackError,
  BidBackCreated,
}

class Props {
  art = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    ...mapGetters('user', ['networkInfo', 'account', 'isConnected']),
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
  isCancelDisabled: boolean = false;
  unstakeAmount: number | null = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;
  formattedBalance: string = '';
  placingBidBackStatus: PlacingBidBackStatus | null = null;
  PlacingBidBackStatus = PlacingBidBackStatus;

  mounted() {
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    this.auctionSystemProxy = new AlgoPainterAuctionSystemProxy(
      this.networkInfo,
    );
    this.auctionCoinTokenProxy = new ERC20TokenProxy(
      this.algoPainterContractByNetworkId,
    );
    this.setAccountBalance().catch(console.error);
    this.setformattedBalance();
  }

  show() {
    this.$refs.dialog.show();
  }

  // hide() {
  //   this.$refs.dialog.hide();
  // }

  // onDialogHide() {
  //   this.$emit('hide');
  // }

  closeModal() {
    this.modal = false;
  }

  declare $refs: {
    dialog: QDialog;
  };

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account'],
        );
      this.setformattedBalance();
    }
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.balance, 2);
  }

  maxStakeAmount() {
    this.unstakeAmount = blockchainToCurrency(
      this.art.bidbacks[this.account],
      this.coinDetails.decimalPlaces,
    );

    return this.$n(this.unstakeAmount, 'decimal', {
      maximumFractionDigits: this.coinDetails.decimalPlaces,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
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
      this.setAccountBalance().catch(console.error);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
  }

  get auctionRewardsContractAddress() {
    return getRewardsSystemContractByNetworkId(this.networkInfo.id);
  }

  get algoPainterContractByNetworkId() {
    return getAlgoPainterContractByNetworkId(this.networkInfo.id);
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
    this.isCancelDisabled = true;

    const { decimalPlaces } = this.coinDetails;

    const unstakeAmount = currencyToBlockchain(
      Number(this.unstakeAmount),
      decimalPlaces,
    );

    await this.approveContractTransfer(unstakeAmount);

    try {
      if (this.unstakeAmount && typeof this.unstakeAmount === 'number') {
        await this.rewardsSystem
          .unstakeBidback(this.art.index, numberToString(unstakeAmount), this.account)
          .on('transactionHash', () => {
            this.placingBidBackStatus =
              PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
          })
          .on('error', () => {
            this.placingBidBackStatus =
              PlacingBidBackStatus.IncreateAllowanceError;
            setTimeout(() => {
              this.$refs.dialog.hide();
              this.$emit('hide');
              this.placingBidBackStatus = null;
              this.unstakeAmount = 0;
            }, 3000);
          });
        this.placingBidBackStatus =
          PlacingBidBackStatus.IncreateAllowanceCompleted;
        setTimeout(() => {
          try {
            this.$store.dispatch({
              type: 'auctions/updateBidBackStakedAlgop',
              collectionOwner: this.art.item.collectionOwner,
              itemIndex: this.art.item.index,
            }).catch(console.error);
          } catch (e) {
            console.log('Error - updateBidBackStakedAlgop - UntackModalAlgop');
          } finally {
            this.$refs.dialog.hide();
            this.$emit('hide');
            this.placingBidBackStatus = null;
            this.unstakeAmount = 0;
          }
        }, 3000);
      }
    } catch (e) {
      console.log('Error - stakeAlgop- unstakeModalAlgop');
    } finally {
      this.isCancelDisabled = false;
      this.isConfirmBtnLoading = false;
      this.isDisabled = true;
    }
  }

  async approveContractTransfer(amount: number) {
    this.placingBidBackStatus = PlacingBidBackStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy.allowance(
      this.account,
      this.auctionRewardsContractAddress,
    );

    if (allowance < amount) {
      this.placingBidBackStatus =
        PlacingBidBackStatus.IncreateAllowanceAwaitingInput;

      const { decimalPlaces } = this.coinDetails;

      const allowanceAmount = currencyToBlockchain(
        Number.MAX_SAFE_INTEGER,
        decimalPlaces,
      );

      await this.auctionCoinTokenProxy
        .approve(
          this.auctionRewardsContractAddress,
          numberToString(allowanceAmount),
          this.account,
        )
        .on('error', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceError;
        })
        .on('transactionHash', () => {
          this.placingBidBackStatus =
            PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
        });
    }
  }
}
</script>
<style scoped>
.margin {
  margin: 0px auto;
}
.inputAl {
  width: 90%;
}
.variable-balance {
  width: 30%;
}
</style>
