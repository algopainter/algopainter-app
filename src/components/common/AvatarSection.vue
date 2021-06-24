<template>
  <div class="flex items-center">
    <div class="items-center">
      <q-item dense class="q-pa-none q-mr-xl">
        <q-item-section side>
          <q-avatar round size="56px">
            <img :src="imageUrl" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="title text-h6 text-bold q-mt-none">
            <slot name="title">{{ title }}</slot>
          </q-item-label>
          <q-item-label
            class="subtitle text-bold text-primary"
            style="margin-top: 0px !important"
            >{{ subTitle }}</q-item-label
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
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
  imageUrl = prop({
    type: String,
    required: true,
  });

  title = prop({
    type: String,
    required: true,
  });

  subTitle = prop({
    type: String,
    required: true,
  });

  description = prop({
    type: String,
    required: false,
  });
}

export default class AvatarSection extends Vue.with(Props) {}
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
