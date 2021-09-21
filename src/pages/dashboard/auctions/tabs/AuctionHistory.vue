<template>
  <div>
    <div
      v-if="loading"
      class="flex flex-center q-pa-lg"
    >
      <q-spinner
        size="80px"
        color="primary"
      />
    </div>
    <div v-else>
      <div
        v-if="users.length === 0"
        class="empty-state"
      >
        {{ $t('dashboard.auctionPage.noOldOwners') }}
      </div>
      <div
        v-else
        class="row q-col-gutter-md"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="col-12"
        >
          <auction-user-card
            :user="user"
            :title="$t('dashboard.auctionPage.oldOwner')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AuctionUserCard from 'components/auctions/auction/AuctionUserCard.vue';
import { IUser } from 'src/models/IUser';
import { getImageOwners } from 'src/api/images';

@Options({
  components: {
    AuctionUserCard,
  },
})
export default class AuctionHistory extends Vue {
  @Prop({ required: true }) auction!: IAuctionItem;

  users: IUser[] = [];
  loading: boolean = false;

  created() {
    void this.loadOldOwners();
  }

  async loadOldOwners() {
    try {
      this.loading = true;

      this.users = await getImageOwners(this.auction.item._id);

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  padding: 16px;
  color: $primary;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
