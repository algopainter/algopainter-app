<template>
  <div>
    <div class="art-header flex q-pb-sm">
      <div class="users">
        <q-avatar
          v-for="person in auction.art.importantPeople"
          :key="person.id"
          size="lg"
          round
        >
          <img :src="person.picture">
          <q-tooltip>{{ person.name }}</q-tooltip>
        </q-avatar>
      </div>
      <q-space />
      <div class="actions flex items-center q-col-gutter-sm">
        <div>
          <q-icon
            color="primary"
            size="sm"
            name="mdi-dots-horizontal"
          />
        </div>
        <div>
          <q-icon
            color="primary"
            size="sm"
            name="mdi-heart-outline"
          />
        </div>
      </div>
    </div>
    <q-img
      class="art-image"
      src="../../assets/placeholder-images/painting.jpg"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ auction.art.name }}
      </div>
      <div>
        <div class="flex items-center q-col-gutter-sm">
          <div class="price">
            <div>{{ $n(auction.art.price, 'currency') }}</div>
          </div>
          <div>
            {{ $t('dashboard.auctions.numberOfBids', {
              numberOfBids: auction.numberOfBids,
            }) }}
          </div>
        </div>
      </div>
      <div class="highest-bid">
        <i18n-t keypath="dashboard.auctions.highestBid">
          <template #highestBid>
            <b class="text-primary">{{ `${auction.highestBid}WETH` }}</b>
          </template>
        </i18n-t>
      </div>
      <q-btn
        flat
        color="primary"
        :label="$t('common.placeABid')"
        icon-right="mdi-arrow-right"
        to="/auctions/123"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';

class Props {
  auction = prop({
    type: Object as PropType<IAuctionItem>,
    required: true,
  });
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class AuctionItem extends Vue.with(Props) {
}
</script>

<style lang="scss" scoped>
.users {
  .q-avatar:not(:first-child) {
    margin-left: -8px;
  }
}

.actions {
  cursor: pointer;
}

.art-image {
  border-radius: 5px;
  width: 300px;
  height: 300px;
}

.details {
  .name {
    font-weight: bold;
    font-size: 1.4rem;
  }

  .price {
    display: flex;
    align-items: center;
    color: $positive;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .highest-bid {
    font-size: 1.1rem;
  }

  .action123 {
    font-size: 0.9rem;
    font-weight: bold;
    color: $primary;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
