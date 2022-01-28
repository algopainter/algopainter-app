/* eslint-disable vue/valid-v-for */
<template>
  <div class="side-bar q-pa-lg">
    <div class="content">
      <q-img src="../assets/icons/ALGOP.svg" class="icon q-ml-sm q-mt-md" />
      <div>
        <component
          :is="item.to ? 'router-link' : 'div'"
          v-for="(item, index) in items"
          :key="index"
          class="item"
          :style="{ 'mask-image': `url(${item.icon})` }"
          :to="item.to"
          @click="item.to ? null : item.onClick()"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            class="bg-primary"
            :offset="[10, 10]"
          >
            <span>{{ item.label }}</span>
          </q-tooltip>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';

interface SideBarItem {
  icon: unknown;
  img?: string;
  to?: string;
  label?: string;
  onClick: () => unknown;
}

@Options({
  computed: {
    ...mapGetters('user', {
      isConnected: 'isConnected',
    }),
  },
})
export default class SideBar extends Vue {
  openModal: boolean = false;
  isConnected!: boolean;

  get items(): SideBarItem[] {
    return [
      {
        icon: require('../assets/icons/home.svg'),
        to: '/',
        label: 'Home',
        onClick: () => undefined,
      },
      {
        icon: require('../assets/icons/my-gallery.svg'),
        label: 'My gallery',
        onClick: () => {
          if (this.isConnected) {
            this.$router.push('/my-gallery').catch(console.error);
          } else {
            this.$emit('userIsNotLogged');
            this.$emit('pageOptionClicked', '/my-gallery');
          }
        },
      },
      {
        icon: require('../assets/icons/magic-wand.svg'),
        label: 'Create collectible',
        onClick: () => {
          if (this.isConnected) {
            this.$router.push('/create-collectible').catch(console.error);
          } else {
            this.$emit('userIsNotLogged');
            this.$emit('pageOptionClicked', '/create-collectible');
          }
        },
      },
      {
        icon: require('../assets/icons/auction.svg'),
        label: 'Bids',
        onClick: () => {
          if (this.isConnected) {
            this.$router.push('/bids').catch(console.error);
          } else {
            this.$store
              .dispatch('user/openConnectYourWalletModal')
              .catch(console.error);
            this.$emit('pageOptionClicked', '/bids');
          }
        },
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
.side-bar {
  .content {
    background: #f4528d;
    display: block;
    border-radius: 20px;
  }
  .icon {
    width: 80%;
  }

  .item {
    display: block;
    display: flex;
    justify-content: center;
    cursor: pointer;
    width: 72px;
    height: 72px;
    background-color: #fff;
    mask-size: 28px 28px;
    mask-repeat: no-repeat;
    mask-position: center center;

    &:hover:not(.router-link-exact-active) {
      opacity: 0.6;
    }

    &.router-link-exact-active {
      background-color: $secondary;
    }
  }
}
</style>
