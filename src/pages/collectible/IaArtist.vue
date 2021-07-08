<template>
  <div class="">
    <div
      class="text-center"
    >
      <q-btn
        class="q-px-xs"
        :class="{
          'btn-border': true,
          off: isOff,
          on: !isOff,
        }"
        @click="active($props.name)"
      >
        <q-img
          class="img"
          :src="img"
        />
      </q-btn>
      <p class="q-mt-md text-bold">
        {{ name }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
class Props {
  id = prop({
    type: String,
    required: true,
  });

  img = prop({
    type: String,
    required: true,
  });

  name = prop({
    type: String,
    required: true,
  });

  title = prop({
    type: String,
    required: true,
  });

  isOff = prop({
    type: Boolean,
    required: true,
  });

  isBorda = prop<(id: string) => void>({
    required: true,
  });
}
@Options({
  components: {},
})
export default class IaArtist extends Vue.with(Props) {
  active(id: string) {
    this.$props.isBorda(id);
  }
}
</script>

<style scoped>
.img {
  width: 130px;
  height: 250px;
}

.btn-border {
  border-radius: 10px;
}

.btn-border.on {
  border: 2px solid #F4538D;
}

.btn-border.off {
  border: none;
}
</style>
