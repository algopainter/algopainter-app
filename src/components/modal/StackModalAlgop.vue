<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    persistent
    class="q-gutter-md"
  >
    <q-card class="q-pa-md">
      <p class="text-bold text-h6">
        {{ $t('dashboard.stackModalAlgop.title') }}
      </p>
      <div>
        <div>
          <div class="row justify-between">
            <div class="flex items-end q-pb-sm text-bold">
              {{ $t('dashboard.stackModalAlgop.stake') }}
            </div>
            <div>
              <div class="variable-balance text-bold">
                {{ $t('dashboard.stackModalAlgop.balance') }}
              </div>
              <div class="q-pb-sm">
                {{ formattedBalance }}
              </div>
            </div>
          </div>
          <q-input
            v-model="stakeAmount"
            class="q-mb-sm"
            type="number"
            rounded
            outlined
            suffix="$ALGOP"
            :rules="[(val) => !!val || $t('dashboard.stackModalAlgop.noAlgop')]"
            no-error-icon="false"
            :bind="validateInput()"
          >
            <template #append>
              <q-btn
                rounded
                color="primary"
                @click="maxStakeAmount"
              >
                {{ $t('dashboard.stackModalAlgop.max') }}
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
            {{ $t('dashboard.stackModalAlgop.interact') }}
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
              $t('dashboard.stackModalAlgop.confirmWallet')
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
              $t('dashboard.stackModalAlgop.error')
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
            {{ $t('dashboard.stackModalAlgop.stakeSucess') }}
          </p>
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              :disabled="isCancelDisabled"
              color="primary"
              class=""
              :label="$t('dashboard.stackModalAlgop.cancel')"
            />
            <algo-button
              type="submit"
              color="primary"
              :label="$t('dashboard.stackModalAlgop.confirm')"
              :disabled="isDisabled"
              :loading="isConfirmBtnLoading"
              @click="stakeAlgop"
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
import AlgoButton from 'components/common/Button.vue';
import { mapGetters } from 'vuex';
import { QDialog } from 'quasar';
import getAlgoPainterContractByNetworkId, {
  getRewardsSystemContractByNetworkId,
} from 'src/eth/Config';
import { numberToString } from 'src/helpers/format/numberToString';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import AlgoPainterAuctionSystemProxy from 'src/eth/AlgoPainterAuctionSystemProxy';
import ERC20TokenProxy from 'src/eth/ERC20TokenProxy';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import UserUtils from 'src/helpers/user';

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
  auctionCoinTokenProxy!: ERC20TokenProxy;
  auctionSystemProxy!: AlgoPainterAuctionSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  isCancelDisabled: boolean = false;
  modal: boolean = true;
  isDisabled: boolean = true;
  stakeAmount: number | null | string = null;
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
    void this.setAccountBalance();
  }

  show() {
    this.$refs.dialog.show();
  }

  // hide() {
  //   this.$refs.dialog.hide();
  //   console.log('hide');
  // }

  // onDialogHide() {
  //   this.$emit('hide');
  //   console.log('onDialogHide');
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
      void this.setformattedBalance();
    }
  }

  setformattedBalance() {
    this.formattedBalance = UserUtils.formatAccountBalance(this.balance, 2);
  }

  maxStakeAmount() {
    this.stakeAmount = this.balance;
  }

  validateInput() {
    this.stakeAmount = Number(this.stakeAmount);
    if (this.stakeAmount <= 0 || this.stakeAmount === null) {
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

  async stakeAlgop() {
    this.isConfirmBtnLoading = true;
    this.isCancelDisabled = true;

    const { decimalPlaces } = this.coinDetails;

    const stakeAmount = currencyToBlockchain(
      Number(this.stakeAmount),
      decimalPlaces,
    );

    await this.approveContractTransfer(stakeAmount);

    try {
      if (this.stakeAmount && typeof this.stakeAmount === 'number') {
        await this.rewardsSystem.stakeBidback(this.art.index, this.stakeAmount, this.account)
          .on('transactionHash', () => {
            this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceAwaitingConfirmation;
          })
          .on('error', () => {
            this.placingBidBackStatus = PlacingBidBackStatus.IncreateAllowanceError;
            setTimeout(() => {
              this.$refs.dialog.hide();
              this.$emit('hide');
              this.placingBidBackStatus = null;
            }, 3000);
          });
        this.placingBidBackStatus =
          PlacingBidBackStatus.IncreateAllowanceCompleted;
        setTimeout(() => {
          this.$refs.dialog.hide();
          this.$emit('hide');
          this.placingBidBackStatus = null;
        }, 3000);
      }
    } catch (e) {
      console.log('error - stakeAlgop BidBack', e);
    } finally {
      this.isCancelDisabled = false;
      this.stakeAmount = 0;
      this.isConfirmBtnLoading = false;
      this.isDisabled = true;
    }
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
