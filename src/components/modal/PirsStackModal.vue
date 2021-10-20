<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    class="q-gutter-md"
    @hide="onDialogHide"
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
          <div class="q-gutter-sm row justify-center">
            <algo-button
              v-close-popup
              type="submit"
              color="primary"
              class=""
              :label="$t('dashboard.stackModalAlgop.cancel')"
            />
            <algo-button
              type="submit"
              color="primary"
              :label="$t('dashboard.stackModalAlgop.confirm')"
              :disabled="isDisabled"
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
import { QDialog, Notify } from 'quasar';
import AlgoPainterRewardsSystemProxy from 'src/eth/AlgoPainterRewardsSystemProxy';
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IMyGallery } from 'src/models/IMyGallery';
import UserUtils from 'src/helpers/user';

class Props {
  algopStack= prop({
    type: Number,
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
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  modal: boolean = true;
  isContractApproved: boolean = true;
  isDisabled: boolean = true;
  stakeAmount: number | null | string = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;
  formattedBalance: string = '';

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

  mounted() {
    this.rewardsSystem = new AlgoPainterRewardsSystemProxy(this.networkInfo);
    void this.setAccountBalance();
  }

  async stakeAlgop() {
    this.isConfirmBtnLoading = true;
    try {
      if (this.stakeAmount && typeof this.stakeAmount === 'number') {
        await this.rewardsSystem.stakePirs(this.art.nft.index, this.stakeAmount, this.account).on('transactionHash', () => {
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

  approveContract() {
    this.isContractApproved = false;
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
