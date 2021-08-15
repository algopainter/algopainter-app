<template>
  <div>
    <div
      class="art-header flex q-pb-sm"
    >
      <div
        v-for="(person, index) in art.users"
        :key="index"
        class="users"
      >
        <router-link :to="{path: 'user-gallery', query: { customProfile: person.account }}">
          <q-avatar
            size="lg"
            class="q-mr-xm"
            round
          >
            <img
              :src="person.avatar || '/images/do-utilizador (1).png'"
            >
            <q-tooltip
              class="bg-primary"
            >
              {{ person.role }}{{ $t('dashboard.homePage.colon') }} {{ person.name }}
            </q-tooltip>
          </q-avatar>
        </router-link>
      </div>
      <q-space />
      <ShareArtIcons :art="art.nft.previewImage" />
    </div>
    <q-img
      class="art-image"
      :src="art.nft.previewImage"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ $t('dashboard.homePage.symbol') }}{{ art.nft.index }} {{ art.description }}
      </div>
      <q-tooltip
        class="bg-primary"
      >
        {{ art.description }}
      </q-tooltip>
      <algoButton
        icon="visibility"
        class="full-width q-my-md"
        color="primary"
        :label="$t('dashboard.auctionPage.btnView')"
        :to="`/collections/${art._id}`"
      />
      <!--
      <q-btn
        v-if="user === false"
        class="sell-action"
        to="/sell-your-art"
        flat
        color="positive"
      >
        {{ $t('dashboard.homePage.sell') }}
        <q-icon name="mdi-arrow-right" />
      </q-btn>
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IMyGallery } from 'src/models/IMyGallery';
import AlgoButton from '../../common/Button.vue';
import ShareArtIcons from '../../common/ShareArtIcons.vue';

class Props {
  art = prop({
    type: Object as PropType<IMyGallery>,
    required: true,
  });

  user = prop({
    type: Boolean,
    required: false,
    default: false,
  });
}
@Options({
  components: {
    AlgoButton,
    ShareArtIcons,
  },
})
export default class GalleryItem extends Vue.with(Props) {

}
</script>

<style lang="scss" scoped>

.cursor-pointer {
  cursor: pointer;
}

.teste {
  width: 100px;
  height: 100px;
  background-color: red;
}

.users {
  .q-avatar:not(:first-child) {
    margin-left: -8px;
  }
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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    width: 250px;
  }

  .price {
    display: flex;
    align-items: center;
    color: $positive;
    font-size: 1.4rem;
    font-weight: bold;

    img {
      display: block;
      height: 23px;
      padding-right: 6px;
    }
  }

  .bid-back {
    display: flex;
    align-items: center;
    color: $primary;
    font-size: 1rem;
    font-weight: bold;

    img {
      display: block;
      height: 20px;
      padding-right: 6px;
    }
  }

  .pirs {
    display: flex;
    font-size: 1rem;

    .label {
      color: $primary;
      padding-right: 6px;
    }

    img {
      display: block;
      height: 20px;
      padding-right: 6px;
    }
  }

  .sell-action {
    font-size: 1.1rem;
    font-weight: bold;
    color: $positive;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
