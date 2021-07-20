<template>
  <avatar-section :image-url="imageUrl">
    <template #title>
      <div class="text-bold text-h6">
        {{ title }}
      </div>
    </template>
    <template #subTitle>
      <div class="subtitle text-primary text-bold">
        {{ subTitle }}
      </div>
    </template>
    <template #description>
      <div class="text-bold">
        {{ description }}
      </div>
    </template>
  </avatar-section>
</template>

<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import AvatarSection from './../AvatarSection.vue';

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

@Options({
  components: {
    AvatarSection,
  },
})
export default class AlgoAvatar extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
.subtitle {
  margin-top: 0px !important;
}
</style>
