<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { QBtn } from 'quasar';

class ImgButtonProps {
  id = prop<string>({ required: true });
  imgSrc = prop<string>({ required: true });
  imgWidth = prop<string>({ required: true });
  imgHeight = prop<string>({ required: true });
  isDisabled = prop<boolean>({ required: true });
  cb = function(id: string) {
    return id;
  };
}

@Options({
  extends: QBtn,
})
export default class ImageButton extends Vue.with(ImgButtonProps) {
  loadIcon(): string {
    return require('../../assets/' + this.$props.imgSrc);
  }

  toggle(id: string) {
    this.$props.cb(id);
  }
}
</script>

<template>
  <div class="q-img-button-wrapper">
    <q-btn
      v-bind="$props"
      :class="{
        'q-img-btn': true,
        off: isDisabled,
        on: !isDisabled,
      }"
      @click="toggle($props.id)"
    >
      <div
        :class="{
          'q-masked-icon': true,
          off: isDisabled,
          on: !isDisabled,
        }"
        :style="{
          'mask-image': `url(${loadIcon()})`,
          width: $props.imgWidth,
          height: $props.imgHeight,
        }"
      />
    </q-btn>
    <div
      :class="{
        'q-img-btn-label': true,
        off: isDisabled,
        on: !isDisabled,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-img-button-wrapper {
  width: 340px;
}

.q-img-btn {
  border-radius: 12px;
  max-width: 340px;
  width: 100vh;
  height: 150px;
  box-sizing: border-box;
  border-radius: 10px;
}

.q-img-btn.on {
  border: 2px solid #F4538D;
}

.q-img-btn.off {
  border: none;
}

.q-masked-icon {
  mask-size: contain, contain;
}

.q-masked-icon.on {
  background-color: #F4538D;
}

.q-masked-icon.off {
  background-color: #C4C4C4;
}

.q-img-btn-label {
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 33px;
  text-align: center;
}

.q-img-btn-label.on {
  color: #000000;
}

.q-img-btn-label.off {
  color: #f4538d;
}
</style>
