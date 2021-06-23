<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QBtn } from 'quasar';

class ImgButtonProps {
  imgSrc = prop<string>({ required: true })
  cb = function (text: string, $event: null) { return $event; }
}

@Options({
  extends: QBtn,
})
export default class ImageButton extends Vue.with(ImgButtonProps) {
  isDisabled = true;

  toggle (event: any) {
    this.isDisabled = !this.isDisabled;
  }
}
</script>

<template>
  <q-btn v-bind="$props"
         class="q-img-btn"
         v-bind:icon="$props.imgSrc"
         v-on:click="toggle($event)"
         :class="{ disabled: isDisabled }"></q-btn>
  <div class="q-img-btn-label"
      :class="{ disabled: isDisabled }"><slot /></div>
</template>

<style lang="scss" scoped>
  .q-img-btn {
    border-radius: 12px;
    min-width: 340px;
    border: 2px solid #F4538D;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .q-img-btn-label {
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 33px;
    color: #000000;
  }

  .q-img-btn-label .disabled {
    color: #F4538D;
  }

  .q-img-btn .disabled {
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    border: none;
  }

  .q-img-btn > .q-icon {
    color: #000;
  }
</style>
