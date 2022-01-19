<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-pa-md">
      <p class="row justify-center text-h5">
        {{ $t('dashboard.selectAlgoP') }}
      </p>
      <div class="row">
        <q-btn
          round
          type="a"
          :to="{name: 'newPainting', params: { collection: 'gwei' } }"
          target="_blank"
        >
          <q-avatar size="250px" class="avatar">
            <img width="150px" class="img" src="/images/gwei.png" />
          </q-avatar>
        </q-btn>
        <q-btn
          round
          type="a"
          :to="{name: 'newPainting', params: { collection: 'expressions' } }"
          target="_blank"
        >
          <q-avatar size="250px" class="avatar">
            <img src="/images/manwithnoname.png" />
          </q-avatar>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QDialog } from 'quasar';
class Props {
  OpenModal = prop({
    type: Boolean,
    required: true,
  });
}
@Options({
  components: {},
})
export default class NewPaintingModal extends Vue.with(Props) {
  onDialogHide() {
    void this.$store.dispatch({
      type: 'collections/openNewPaintingModal',
    });
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

@media (max-width: 450px) {
  .avatar {
    width: 140px;
    height: 140px;
  }
}
</style>
