<template>
  <q-dialog
    ref="dialog"
    v-model="modal"
    @hide="onDialogHide; openAuctionModal()"
  >
    <q-card class="q-pa-lg q-mb-sm">
      <p class="row justify-center text-h5">
        {{ $t('dashboard.auctions.auctionController') }}
      </p>
      <div class="column">
        <div class="row">
          <p>{{ testValue + ' ' + $t('dashboard.auctions.BNBearned') }}</p>
        </div>
        <div class="row">
          <q-input
            unmasked-value
            placeholder="0.000"
          />
          <algoButton
            class="q-my-md action"
            color="primary"
            :label="$t('dashboard.auctions.harvest')"
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
          <div class="row ">
            <div>
              <q-btn
                class="q-my-md q-mx-sm action"
                color="primary"
                :label="$t('dashboard.auctions.minusSymbol')"
                rounded
              />
              <q-btn
                class="q-my-md action"
                color="primary"
                :label="$t('dashboard.auctions.plusSymbol')"
                rounded
              />
            </div>
          </div>
        </div>
        <algoButton
          class="q-my-md action"
          color="primary"
          :label="$t('dashboard.auctions.claim')"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QDialog } from 'quasar';
import AlgoButton from 'src/components/common/Button.vue';

class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  })
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
  .avatar{
    width: 140px;
    height: 140px;
  }
}
</style>
