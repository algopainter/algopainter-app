<template>
  <div class="flex items-center">
    <div class="items-center">
      <q-item
        dense
        class="q-pa-none"
      >
        <q-item-section side>
          <q-avatar
            round
            :size="size"
          >
            <img :src="imageUrl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="title q-mt-none">
            <slot name="title">
              {{ title }}
            </slot>
          </q-item-label>
          <q-item-label class="subtitle">
            <slot name="subTitle">
              {{ subTitle }}
            </slot>
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <q-space />
    <slot name="description">
      <div class="text-bold">
        {{ description }}
      </div>
    </slot>
    <q-space />
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

  size = prop({
    type: String,
    required: false,
    default: '56px',
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
