<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="user in users"
      :key="user._id"
      class="col-12"
    >
      <auction-user-card
        :user="user"
        :title="$t('dashboard.auctionPage.oldOwner')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IUser } from 'src/models/IUser';
import AuctionUserCard from 'components/auctions/auction/AuctionUserCard.vue';

@Options({
  components: {
    AuctionUserCard,
  },
})
export default class AuctionHistory extends Vue {
  @Prop({ required: true }) users!: IUser[];
}
</script>
