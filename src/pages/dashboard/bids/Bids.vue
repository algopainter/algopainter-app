<template>
  <q-card
    v-for="(bid, index) in auctionsBid"
    :key="index"
    class="row justify-center container-bids"
    bordered
  >
    <div class="col-xs-12 col-sm-12 col-md-7">
      <div class="row q-gutter-md">
        <q-img
          class="img"
          :src="bid.item.previewImage"
        />
        <div class="text-title">
          <p class="text-bold">
            {{ bid.item.title }}
          </p>
          <p>
            {{ bid.item.description }}
          </p>
          <div class="row q-gutter-sm">
            <div
              v-for="(user, i) in bid.users"
              :key="i"
              class="row"
            >
              <router-link :to="{name: 'customUrl', params: { customUrl: user.customProfile || user.account } }">
                <q-avatar
                  size="lg"
                  round
                >
                  <img
                    :src="user.avatar || '/placeholder-images/do-utilizador.png'"
                  >
                  <q-tooltip
                    class="bg-primary"
                  >
                    {{ user.role }}{{ $t('dashboard.homePage.colon') }} {{ user.name }}
                  </q-tooltip>
                </q-avatar>
              </router-link>
            </div>
          </div>
          <div class="row q-mt-md q-gutter-sm text-center">
            <div class="col">
              <div class="text-bold">
                {{ $t('dashboard.bid.winBid') }}
              </div>
              <div class="text-bold">
                {{ $t('dashboard.bid.eth') }}
              </div>
              <div>
                {{ $t('dashboard.bid.money') }}
              </div>
            </div>

            <q-separator
              vertical
              inset
            />

            <div class="col">
              <div>
                <div class="text-bold">
                  {{ $t('dashboard.bid.auctionEnd') }}
                </div>
                <div class="text-bold">
                  {{ $t('dashboard.bid.data') }}
                </div>
                <div>
                  {{ $t('dashboard.bid.2020') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-separator
      vertical
      inset
    />
    <div class="col-xs-12 col-sm-12 col-md-4 col column justify-center ">
      <div class="text-bold text-h5 row justify-center">
        {{ $t('dashboard.bid.youNow') }}
      </div>
      <div class="text-bold row text-center">
        {{ $t('dashboard.bid.congratulations') }}
      </div>
      <div class="row justify-center q-mt-md">
        <algo-button
          size="lg"
          color="primary"
          :label="$t('dashboard.bid.clain')"
        />
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IAuctionItem } from 'src/models/IAuctionItem';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})

export default class Bids extends Vue {
auctionsBid: IAuctionItem[] = [];

mounted() {
  void this.getBids();
}

getBids() {
  void this.$store.dispatch({
    type: 'auctions/getBids',
  }).then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.auctionsBid = this.$store.getters['auctions/getBids'] as [];
  });
}
}
</script>
<style lang="scss">
.container-bids{
  max-width: 100%;
  max-height: 100%;
  border-radius: 20px;
  padding: 20px;
}
.img{
  width: 250px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}

.text-title{
  width: 250px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}

</style>
