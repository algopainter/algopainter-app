/* eslint-disable vue/valid-v-for */
<template>
  <div class="side-bar q-pa-lg">
    <div class="content">
      <q-img
        src="../assets/icons/ALGOP.svg"
        class="icon q-ml-sm q-mt-md"
      />
      <component
        :is="item.to ? 'router-link' : 'div'"
        v-for="item, index in items"
        :key="index"
        class="item"
        :style="{'mask-image': `url(${item.icon})`}"
        :to="item.to"
        @click="item.to ? null : item.onClick"
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
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

interface SideBarItem {
  icon: unknown;
  img?: string;
  to?: string;
  label?: string;
  onClick?: () => unknown;
}

export default class SideBar extends Vue {
  get items(): SideBarItem[] {
    return [
      {
        icon: require('../assets/icons/home.svg'),
        to: '/',
        label: 'Home',
      },
      {
        icon: require('../assets/icons/my-gallery.svg'),
        to: '/my-gallery',
        label: 'My Gallery',
      },
      {
        icon: require('../assets/icons/paint-board-and-brush.svg'),
        to: '/create-collectible',
        label: 'Create collectible',
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
  .icon{
    width: 80%;
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
