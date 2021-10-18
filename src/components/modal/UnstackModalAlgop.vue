<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide"
  >
    <q-card class="q-pa-md">
      <p class="text-bold text-h6">
        {{ $t('dashboard.stackModalAlgop.titleUnstack') }}
      </p>
      <div>
        <div>
          <div class="row justify-between">
            <div>
              {{ $t('dashboard.stackModalAlgop.stake') }}
            </div>
            <div class="variable-balance">
              {{ $t('dashboard.stackModalAlgop.balance') }}
            </div>
          </div>
          <q-input
            v-model="unstakeAmount"
            type="number"
            rounded
            outlined
            suffix="$ALGOP"
            :rules="[val => !!val || 'No Tokens to stake.']"
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
import { NetworkInfo } from 'src/store/user/types';
import { Watch } from 'vue-property-decorator';
import { IAuctionItem } from 'src/models/IAuctionItem';
import UserUtils from 'src/helpers/user';

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
  networkInfo!: NetworkInfo;
  account!: string;
  isConnected!: boolean;
  modal: boolean = true;
  isContractApproved: boolean = true;
  isDisabled: boolean = true;
  unstakeAmount: number | null | string = null;
  isConfirmBtnLoading: boolean = false;
  balance: number = 0;

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
    }
  }

  maxStakeAmount() {
    this.unstakeAmount = this.balance;
  }

  validateInput() {
    this.unstakeAmount = Number(this.unstakeAmount);
    if (this.unstakeAmount <= 0 || this.unstakeAmount === null) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
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

  async unstakeAlgop() {
    this.isConfirmBtnLoading = true;
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
