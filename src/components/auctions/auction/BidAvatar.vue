<template>
  <avatar-section
    class="q-py-md"
    :image-url="bid.bidder.avatar"
  >
    <template #title>
      <div class="text-positive text-bold text-h6">
        {{ $n(bid.amount, 'currency') }}
      </div>
    </template>
    <template #subTitle>
      <div class="text-primary text-bold">
        {{ bid.bidder.name }}
      </div>
    </template>
    <template #description>
      <div>
        {{
          $t('dashboard.auctionPage.bidBackPercentage', {
            bidBackPercentage: $n(fee.bidBack*10, 'percent'),
          })
        }}
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

  fee = prop({
    type: Object as PropType<IBid>,
    required: true,
  });
}

@Options({
  components: {
    AvatarSection,
  },
})
export default class BidAvatar extends Vue.with(Props) {

}
</script>
