<template>
  <avatar-section
    class="q-py-md"
    :image-url="bid.bidder.avatar"
  >
    <template #title>
      <div class="text-bold">
        <i18n-t keypath="dashboard.auctionPage.previousBid">
          <template #bidPrice>
            <span class="text-positive">{{ $n(bid.amount, 'currency') }}</span>
          </template>
          <template #bidAtInDays>
            {{ bidAtInDays(bid) }}
          </template>
        </i18n-t>
      </div>
    </template>
    <template #subTitle>
      <div class="text-primary text-bold">
        {{
          $t('dashboard.auctionPage.previousBidBy', {
            name: bid.bidder.name,
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
}

@Options({
  components: {
    AvatarSection,
  },
})
export default class PreviousBidAvatar extends Vue.with(Props) {
  bidAtInDays(bid: IBid) {
    return 2;
  }
}
</script>

<style lang="scss" scoped></style>
