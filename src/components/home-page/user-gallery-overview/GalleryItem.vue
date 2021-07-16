<template>
  <div>
    <div class="art-header flex q-pb-sm">
      <div class="users">
        <q-avatar
          v-for="person in art.importantPeople"
          :key="person.id"
          size="lg"
          round
        >
          <img :src="person.picture">
          <q-tooltip
            class="bg-primary"
          >
            {{ person.accountable }}{{ $t('dashboard.homePage.colon') }} {{ person.name }}
          </q-tooltip>
        </q-avatar>
      </div>
      <q-space />
      <q-btn-dropdown
        class="btn-dropdown"
        dropdown-icon="mdi-dots-horizontal"
      >
        <q-list>
          <q-item
            v-for="opçoesredes in socialNetworks"
            :key="opçoesredes.value"
            v-close-popup
            clickable
          >
            <q-item-section>
              <q-item-label>
                <q-icon
                  color="primary"
                  size="sm"
                  :name="opçoesredes.name"
                />
                {{ opçoesredes.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <q-img
      class="art-image"
      src="../../../assets/placeholder-images/painting.jpg"
    />
    <div class="details q-pa-sm">
      <div class="name">
        {{ art.name }}
      </div>
      <div class="q-py-sm">
        <div class="flex q-col-gutter-sm">
          <div class="price">
            <img src="../../../assets/icons/coin.svg">
            <div>{{ $n(art.price, 'currency') }}</div>
          </div>
          <div class="bid-back">
            <img src="../../../assets/icons/return-on-investment.svg">
            <div>
              {{ $n(art.bidBack, 'percent') }} {{ $t('common.bidBack') }}
            </div>
          </div>
        </div>
        <div class="pirs">
          <img src="../../../assets/icons/return-on-investment.svg">
          <div>
            <span class="label">
              {{ $t('dashboard.homePage.pirs') }}
            </span>
            <i18n-t keypath="dashboard.homePage.pirsVal">
              <template #creators>
                {{ $n(art.pirs.creators, 'percent') }}
              </template>
              <template #investors>
                {{ $n(art.pirs.investors, 'percent') }}
              </template>
            </i18n-t>
          </div>
        </div>
      </div>
      <q-btn
        class="sell-action"
        to="/sell-your-art"
        flat
        color="positive"
      >
        {{ $t('dashboard.homePage.sell') }}
        <q-icon name="mdi-arrow-right" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Vue, Options, prop } from 'vue-class-component';

import { IArt } from 'src/models/IArt';
import AlgoButton from '../../common/Button.vue';

class Props {
  art = prop({
    type: Object as PropType<IArt>,
    required: true,
  });
}
interface Ioptions {
  socialNetworks: string;
}
@Options({
  components: {
    AlgoButton,
  },
})
export default class UserGalleryOverview extends Vue.with(Props) {
options: Ioptions = {
  socialNetworks: '',
}

socialNetworks = [
  {
    value: 0,
    label: 'Facebook',
    name: 'facebook',
  },
  {
    value: 1,
    label: 'Instagran',
    name: 'mdi-instagram',
  },
  {
    value: 0,
    label: 'Twitter',
    name: 'mdi-twitter',
  },
  {
    value: 0,
    label: 'Telegram',
    name: 'mdi-telegram',
  },
  {
    value: 0,
    label: 'E-mail',
    name: 'mdi-email',
  },
]
}
</script>

<style lang="scss" scoped>
.btn-dropdown{
  color: #f4538d;
}
.btn-dropdown:before{
  box-shadow: none;
  border: none;
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
