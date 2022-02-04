<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    class="q-gutter-md"
    persistent
  >
    <q-card
      class="q-pa-md"
    >
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
            :rules="[val => !!val || $t('dashboard.stackModalAlgop.noAlgop')]"
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

export default class PirsStackModal extends Vue.with(Props) {
  rewardsSystem!: AlgoPainterRewardsSystemProxy;
  auctionCoinTokenProxy!: ERC20TokenProxy;
  auctionSystemProxy!: AlgoPainterAuctionSystemProxy;
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  isCancelDisabled: boolean = false;
  modal: boolean = true;
  isDisabled: boolean = true;
  stakeAmount: number | null = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;
  formattedBalance: string = '';
  settingPirsStatus: SettingPirsStatus | null = null;
  SettingPirsStatus = SettingPirsStatus;

  mounted() {
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    this.auctionSystemProxy = new AlgoPainterAuctionSystemProxy(this.networkInfo);
    this.auctionCoinTokenProxy = new ERC20TokenProxy(this.algoPainterContractByNetworkId);
    this.setAccountBalance().catch(console.error);
  }

  get auctionRewardsContractAddress() {
    return getRewardsSystemContractByNetworkId(this.networkInfo.id);
  }

  get algoPainterContractByNetworkId() {
    return getAlgoPainterContractByNetworkId(this.networkInfo.id);
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

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
      this.setformattedBalance();
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
      this.setAccountBalance().catch(console.error);
    }
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    }
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
        this.isConfirmBtnLoading = false;
        this.isCancelDisabled = false;
        setTimeout(() => {
          this.$refs.dialog.hide();
          this.$emit('hide');
          this.settingPirsStatus = null;
          this.stakeAmount = 0;
        }, 1000);
      }).on('transactionHash', () => {
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceAwaitingConfirmation;
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
      await this.rewardsSystem.stakePirs(
        this.itemPirs.index,
        numberToString(stakeAmount),
        this.account).on('transactionHash', () => {
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceAwaitingConfirmation;
      }).on('error', () => {
        this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceError;
        setTimeout(() => {
          this.$refs.dialog.hide();
          this.$emit('hide');
          this.settingPirsStatus = null;
          this.stakeAmount = 0;
        }, 3000);
      });
      this.settingPirsStatus = SettingPirsStatus.IncreateAllowanceCompleted;
      setTimeout(() => {
        try {
          this.$store.dispatch({
            type: 'auctions/updatePirsStakedAlgop',
            collectionOwner: this.itemPirs.item.collectionOwner,
            itemIndex: this.itemPirs.item.index,
          }).catch(console.error);
        } catch (e) {
          console.log('Error - updatePirsStakedAlgop - PirsStackModal');
        } finally {
          this.$refs.dialog.hide();
          this.$emit('hide');
          this.settingPirsStatus = null;
          this.stakeAmount = 0;
        }
      }, 3000);
    } catch (e) {
      console.log('Error - stakeAlgop - PirsStackModal', e);
    } finally {
      this.isCancelDisabled = false;
      this.isDisabled = true;
      this.isConfirmBtnLoading = false;
    }
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

  declare $refs: {
    dialog: QDialog;
  };
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
