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
            :rules="[val => !!val || 'No Tokens to unstake.']"
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
            v-if="settingPirsStatus === SettingPirsStatus.CheckingAllowance"
            class="q-mb-lg"
          >
            <q-icon
              name="mdi-alert-circle"
              color="yellow"
              size="md"
            /> {{ $t('dashboard.stackModalAlgop.interact') }}
          </p>
          <p
            v-else-if="settingPirsStatus === SettingPirsStatus.IncreateAllowanceAwaitingConfirmation"
          >
            <q-icon
              name="mdi-alert"
              color="yellow"
              size="md"
            />{{ $t('dashboard.stackModalAlgop.confirmWallet') }}
          </p>
          <p
            v-else-if="settingPirsStatus === SettingPirsStatus.IncreateAllowanceError"
          >
            <q-icon
              name="mdi-alert-circle"
              color="red"
              size="md"
            />{{ $t('dashboard.stackModalAlgop.error') }}
          </p>
          <p
            v-else-if="settingPirsStatus === SettingPirsStatus.IncreateAllowanceCompleted"
          >
            <q-icon
              name="mdi-check"
              color="green"
              size="md"
            /> {{ $t('dashboard.stackModalAlgop.stakeSucess') }}
          </p>
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              color="primary"
              class=""
              :disabled="isCancelDisabled"
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
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IMyGallery } from 'src/models/IMyGallery';
import UserUtils from 'src/helpers/user';
import getAlgoPainterContractByNetworkId, { getRewardsSystemContractByNetworkId } from 'src/eth/Config';
import { numberToString } from 'src/helpers/format/numberToString';
import { auctionCoins } from 'src/helpers/auctionCoins';
import { currencyToBlockchain } from 'src/helpers/format/currencyToBlockchain';
import { IAuctionItem } from 'src/models/IAuctionItem';

enum SettingPirsStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  SetPirsAwaitingInput,
  SetPirsAwaitingConfirmation,
  SetPirsError,
  PirsSet,
}

class Props {
  itemPirs = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  })

  art = prop({
    type: Object as PropType<IMyGallery>,
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
export default class PirsUnstackModal extends Vue.with(Props) {
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  auctionSystemProxy!: AlgoPainterAuctionSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  modal: boolean = true;
  isDisabled: boolean = true;
  isCancelDisabled: boolean = false;
  unstakeAmount: number | null | string = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;
  formattedBalance: string = '';
  settingPirsStatus: SettingPirsStatus | null = null;
  SettingPirsStatus = SettingPirsStatus;

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
      const { tokenPriceAddress } = this.itemPirs.minimumBid;

      return coin.tokenAddress.toLowerCase() === tokenPriceAddress;
    });

    if (!coin) {
      throw new Error('COIN_NOT_FOUND');
    }

    return coin;
  }

  async approveContractTransfer(amount: number) {
    this.settingPirsStatus = SettingPirsStatus.CheckingAllowance;

    const allowance = await this.auctionCoinTokenProxy
      .allowance(this.account, this.auctionRewardsContractAddress);

    if (allowance < amount) {
      this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceAwaitingInput;

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
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceError;
      }).on('transactionHash', () => {
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceAwaitingConfirmation;
      });
    }
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
        await this.rewardsSystem.unstakePirs(this.itemPirs.index, this.unstakeAmount, this.account).on('transactionHash', () => {
          this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceAwaitingConfirmation;
        }).on('error', () => {
          this.isCancelDisabled = false;
          this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceError;
          // this.deleteAuctionStatus = DeletingAuctionStatus.DeleteAuctionError;
        });
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceCompleted;
        this.isCancelDisabled = false;
        this.isDisabled = true;
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('error.code', error.code);
    }

    this.isConfirmBtnLoading = false;
  }

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
      this.unstakeAmount = await this.rewardsSystem.getTotalPirsStakes(this.art.nft.index);
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

  closeModal() {
    this.modal = false;
  }

  declare $refs: {
    dialog: QDialog;
  };

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    this.$refs.dialog.hide();
  }

  onDialogHide() {
    this.$emit('hide');
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
