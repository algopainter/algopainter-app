<template>
  <q-btn v-bind="$props">
    <slot />
  </q-btn>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QBtn } from 'quasar';

class Props {
  unelevated = prop<boolean>({ default: true })
  noCaps = prop<boolean>({ default: true })
}

@Options({
  extends: QBtn,
})
export default class Button extends Vue.with(Props) {
}
</script>

<style lang="scss" scoped>
.q-btn {
  border-radius: 12px;
  min-width: 180px;
}
</style>
