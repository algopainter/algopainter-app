<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="
      onDialogHide;
      openAuctionModal();
    "
  >
    <q-card class="q-pa-lg q-mb-sm">
      <p class="row justify-center text-h5 text-bold">
        {{ $t('dashboard.auctions.auctionController') }}
      </p>
      <div class="row">
        <p class="text-bold">
          {{ $t(`dashboard.auctions.currentBalance`) }}
        </p>
        <p>{{ $t(`dashboard.algop`) }} {{ formattedBalance() }}</p>
      </div>
      <div class="column">
        <div class="row justify-center">
          <algoButton
            class="q-my-md q-mr-sm action"
            color="primary"
            :label="$t('dashboard.auctions.pirs')"
            :disable="!isAPastOwner"
            @click="
              changeCurrentBtnClicked(1),
              disableHarvestButton(),
              disableStackButton()
            "
          />
          <algoButton
            class="q-my-md action"
            color="primary"
            :label="$t('dashboard.auctions.bidBack')"
            :disable="!hasBidded"
            @click="
              changeCurrentBtnClicked(2),
              disableHarvestButton(),
              disableStackButton()
            "
          />
        </div>
        <div class="row">
          <p>{{ testValue + ' ' + $t('dashboard.auctions.BNBearned') }}</p>
        </div>
        <div class="row justify-center">
          <q-input
            unmasked-value
            placeholder="0.000"
          />
          <algoButton
            class="q-my-md q-ml-sm action"
            :label="$t('dashboard.auctions.harvest')"
            color="primary"
            :disable="!isHarvestBtn"
          />
        </div>
        <div class="row">
          <p>{{ testValue + ' ' + $t('dashboard.auctions.stakedAlgop') }}</p>
        </div>
        <div class="row">
          <q-input
            unmasked-value
            placeholder="0.000"
          />
          <div class="row">
            <div>
              <q-btn
                class="q-my-md q-mx-sm action"
                :label="$t('dashboard.auctions.minusSymbol')"
                rounded
                color="primary"
                :disable="!isUnstackBtnEnabled"
              />
              <q-btn
                class="q-my-md action"
                :label="$t('dashboard.auctions.plusSymbol')"
                rounded
                color="primary"
                :disable="!isStackBtnEnabled"
              />
            </div>
          </div>
        </div>
        <algoButton
          class="q-my-md action"
          color="primary"
          :disable="!isAuctionWinner"
          :label="$t('dashboard.auctions.claim')"
          @click="claimItem"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QDialog } from 'quasar';
import AlgoButton from 'src/components/common/Button.vue';
import UserUtils from 'src/helpers/user';
import { Watch } from 'vue-property-decorator';

class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  });
}
@Options({
  components: {
    AlgoButton,
  },
})
export default class AuctionModal extends Vue.with(Props) {
  modal: boolean = false;
  testMessage: string = 'Stack Algop';
  testValue: number = 0;
  currentBtnClicked: undefined | number = 0;
  isAPastOwner: boolean = true;
  hasBidded: boolean = false;
  hasStackedPirs: boolean = true;
  hasStackedBidBack: boolean = false;
  isAuctionWinner: boolean = false; // Check if the auction is over before setting this variable to true
  isHarvestBtn: boolean = false;
  isStackBtnEnabled: boolean = false;
  isUnstackBtnEnabled: boolean = false;
  userHasAlgop: boolean = true;
  isAuctionEnded: boolean = false;
  userBalance: number = 0;

  changeCurrentBtnClicked(currentBtnClicked: number) {
    this.currentBtnClicked = currentBtnClicked;
  }

  disableHarvestButton() {
    if (this.currentBtnClicked === 0) {
      this.isHarvestBtn = false;
    } else if (!this.isAuctionEnded) {
      this.isHarvestBtn = false;
    } else if (this.currentBtnClicked === 1 && !this.hasStackedPirs) {
      this.isHarvestBtn = false;
    } else if (this.currentBtnClicked === 2 && !this.hasStackedBidBack) {
      this.isHarvestBtn = false;
    } else {
      this.isHarvestBtn = true;
    }
  }

  disableUnstackButton() {
    if (this.currentBtnClicked === 0) {
      this.isUnstackBtnEnabled = false;
    } else if (this.currentBtnClicked === 1 && !this.hasStackedPirs) {
      this.isUnstackBtnEnabled = false;
    } else if (this.currentBtnClicked === 2 && !this.hasStackedBidBack) {
      this.isUnstackBtnEnabled = false;
    } else {
      this.isUnstackBtnEnabled = true;
    }
  }

  disableStackButton() {
    if (this.currentBtnClicked === 0) {
      this.isStackBtnEnabled = false;
    } else if (this.currentBtnClicked === 1 && !this.userHasAlgop) {
      this.isStackBtnEnabled = false;
    } else if (this.currentBtnClicked === 2 && !this.userHasAlgop) {
      this.isStackBtnEnabled = false;
    } else {
      this.isStackBtnEnabled = true;
    }
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/account'];
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  async setAccountBalance() {
    this.userBalance =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account'],
      );
  }

  formattedBalance() {
    return UserUtils.formatAccountBalance(this.userBalance, 2);
  }

  show() {
    this.$refs.dialog.show();
  }

  hide() {
    this.$refs.dialog.hide();
  }

  openAuctionModal() {
    void this.$store.dispatch('auctions/openAuctionModal');
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
}
</script>
<style scoped>
.avatar {
  width: 250px;
}

p {
  margin: 0px;
}

@media (max-width: 450px) {
  .avatar {
    width: 140px;
    height: 140px;
  }
}
</style>
