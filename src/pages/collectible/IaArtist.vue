<template>
  <div class="col-4 text-center">
    <q-btn
      @click="active($props.name)"
      :class="{
        'btn-border': true,
        off: isOff,
        on: !isOff,
      }"
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
    required: true
  });

}
@Options({
  components: {},
})
export default class IaArtist extends Vue.with(Props) {
  active(id: string) {
    console.log("funcionaa!!")
    this.$props.isBorda(id);
  }

}
</script>

<style scoped>
.img {
  padding: 10px 50px;
  width: 150px;
  height: 264px;
  cursor: pointer;
}

.btn-border {
  padding: 21px 56px;
  border-radius: 10px;
}

.btn-border.on {
  border: 2px solid #F4538D;
}

.btn-border.off {
  border: none;
}
</style>
