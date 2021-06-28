<template>
  <div class="q-py-md">
    <div class="flex items-center">
      <div class="items-center">
        <q-item dense class="q-pa-none q-mr-xl">
          <q-item-section side>
            <q-avatar round size="56px">
              <img :src="imageUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="title q-mt-none text-h6 text-bold">
              <slot name="title">{{ title }}</slot>
            </q-item-label>
            <q-item-label
              class="subtitle text-bold text-primary"
              style="margin-top: 0px !important"
            >
              <slot name="subTitle">
                {{ subTitle }}
              </slot></q-item-label
            >
          </q-item-section>
        </q-item>
      </div>
      <slot name="description">
        <div class="text-bold">
          {{ description }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
  imageUrl = prop({
    type: String,
  });

  title = prop({
    type: String,
  });

  subTitle = prop({
    type: String,
  });

  description = prop({
    type: String,
  });
}

export default class AlgoAvatar extends Vue.with(Props) {}
</script>

<style lang="scss" scope>
.title {
  line-height: 1.375rem;
}
.subtitle {
  line-height: 1.3rem;
  font-size: 1rem;
}
</style>
