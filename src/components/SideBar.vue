<template>
  <div class="side-bar q-pa-lg">
    <div class="content">
      <component
        :is="item.to ? 'router-link' : 'div'"
        v-for="item, index in items"
        :key="index"
        class="item"
        :style="{'mask-image': `url(${item.icon})`}"
        :to="item.to"
        @click="item.to ? null : item.onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

interface SideBarItem {
  icon: unknown;
  to?: string;
  onClick?: () => unknown;
}

export default class SideBar extends Vue {
  get items(): SideBarItem[] {
    return [
      {
        icon: require('../assets/icons/home.svg'),
        to: '/',
      },
      {
        icon: require('../assets/icons/paint-board-and-brush.svg'),
        to: '/new-painting',
      },
      {
        icon: require('../assets/icons/magic-wand.svg'),
        to: '/create-collectible',
      },
      {
        icon: require('../assets/icons/auction.svg'),
        to: '/auctions',
      },
      {
        icon: require('../assets/icons/logout.svg'),
        onClick: () => ({}),
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

  .item {
    display: block;
    display: flex;
    justify-content: center;
    cursor: pointer;
    width: 72px;
    height: 72px;
    background-color: #FFF;
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
