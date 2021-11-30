<template>
  <q-input
    v-model="value"
    v-bind="$props"
    @focus.stop="onFocus"
  >
    <template #append>
      <q-icon
        name="mdi-clock"
        class="cursor-pointer"
        @click.stop
      >
        <q-popup-proxy
          ref="timeRef"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time
            v-model="value"
            :options="options"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import { QPopupProxy } from 'quasar';
import { Vue, Options, Model, Ref, Prop } from 'vue-property-decorator';

@Options({
  components: {},
})
export default class TimeField extends Vue {
  @Ref('timeRef') timeRef!: QPopupProxy;
  @Model('modelValue') value!: string;
  @Prop() options!: unknown;

  onFocus() {
    this.timeRef.show();
  }
}
</script>
