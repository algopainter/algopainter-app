<template>
  <q-dialog
    ref="dialog"
    persistent
  >
    <q-card class="row full-width ">
      <q-card-section class="header">
        {{ }}
      </q-card-section>
      <q-card-section>
        <div class="steps row q-col-gutter-md">
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                size="60px"
                color="primary"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{ }}
              </div>
              <div>
                {{ }}
              </div>
            </div>
          </div>
          <div class="col-12 step">
            <div class="avatar">
              <q-avatar
                size="60px"
                color="grey"
                text-color="white"
              >
                <q-icon name="mdi-cancel" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="warning"
                text-color="white"
              >
                <q-icon name="mdi-alert" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="primary"
                text-color="white"
              >
                <q-spinner color="white" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="negative"
                text-color="white"
              >
                <q-icon name="mdi-alert-circle" />
              </q-avatar>
              <q-avatar
                size="60px"
                color="positive"
                text-color="white"
              >
                <q-icon name="mdi-check" />
              </q-avatar>
            </div>
            <div class="label">
              <div class="title">
                {{}}
              </div>
              <div>
                {{ }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="flex justify-end">
        <algo-button
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class CollectionModal extends Vue {

}
</script>
<style scoped>

</style>