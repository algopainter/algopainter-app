<template>
  <avatar-section
    class="q-py-md"
    :imageUrl="bid.user.profilePhotoUrl"
  >
    <template #title>
      <div class="text-positive text-bold text-h6">
        {{ $n(bid.price, 'currency') }}
      </div>
    </template>
    <template #subTitle>
      <div class="text-primary text-bold">
        {{ bid.user.name }}
      </div>
    </template>
    <template #description>
      <div>
        {{
          $t('dashboard.auctionPage.bidBackPercentage', {
            bidBackPercentage: $n(bid.art.bidBack, 'percent'),
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
export default class BidAvatar extends Vue.with(Props) {

}
</script>
