<template>
  <avatar-section
    class="q-py-md"
    :imageUrl="bid.user.profilePhotoUrl"
  >
    <template #title>
      <div class="text-bold">
        <i18n-t keypath="dashboard.auctionPage.highestBidBy">
          <template #highestBidBy>
            <span class="text-primary">{{ bid.user.name }}</span>
          </template>
        </i18n-t>
      </div>
    </template>
    <template #subTitle>
      <div class="price text-bold text-positive">
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
export default class AuctionHighestBidAvatar extends Vue.with(Props) {}
</script>
