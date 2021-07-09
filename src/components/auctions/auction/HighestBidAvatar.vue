<template>
  <avatar-section
    class="q-py-md"
    :imageUrl="bid.user.profilePhotoUrl"
    size="68px"
  >
    <template #title>
      <div class="text-h6 text-white text-bold">
        <i18n-t keypath="dashboard.auctionPage.highestBidBy">
          <template #highestBidBy>
            <span class="title-color">{{ bid.user.name }}</span>
          </template>
        </i18n-t>
      </div>
    </template>
    <template #subTitle>
      <div class="price text-bold text-h6">
        {{ $n(bid.price, 'currency') }}
      </div>
    </template>
  </avatar-section>
</template>

<script lang="ts">
import { IBid } from 'src/models/IBid';
import { Options, prop, Vue } from 'vue-class-component';
import { PropType } from 'vue';
import AvatarSection from 'src/components/AvatarSection.vue';

class Props {
  bid = prop({
    type: Object as PropType<IBid>,
    required: true,
  });
}

@Options({
  components: {
    AvatarSection,
  },
})
export default class HighestBidAvatar extends Vue.with(Props) {}
</script>
<style scoped>
.title-color {
  color: #333333;
}
.price {
  color: #FFCB00;
}
</style>