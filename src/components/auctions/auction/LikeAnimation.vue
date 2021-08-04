<template>
  <div>
    <div class="icons text-center flex justify-center">
      <div class="favorite">
        <div>
          <q-icon
            color="primary"
            size="1.7rem"
            :name="liked ? 'mdi-heart' : 'mdi-heart-outline'"
            :class="{
              press: liked,
              shake: liked,
            }"
            @click="favoriteClicked()"
          />
          <div class="text-primary">
            {{ likes }}
          </div>
          <span :class="{ press: liked }">{{
            $t('dashboard.auctionPage.liked')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';

class Props {
  likes = prop({
    required: true,
    type: Number,
    default: 0,
  });

  liked = prop({
    required: false,
    type: Boolean,
    default: false,
  });
}

@Options({
  computed: {
    isConnected: false,
  },
})
export default class LikeAnimation extends Vue.with(Props) {
  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  favoriteClicked() {
    this.$emit('favoriteClicked', !this.liked);
  }
}
</script>

<style lang="scss" scoped>
.favorite {
  div {
    height: 40px;
    margin: 0 auto;
    position: relative;
    cursor: pointer;
  }
  @keyframes fade {
    0% {
      color: rgba(255, 255, 255, 0);
    }
    50% {
      color: $primary;
    }
    100% {
      color: rgba(255, 255, 255, 0);
    }
  }
  span {
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    visibility: hidden;
    transition: 0.6s;
    z-index: -2;
    font-size: 3px;
    color: transparent;
    font-weight: 400;
  }
  span.press {
    bottom: 40px;
    left: -7px;
    font-size: 14px;
    visibility: visible;
    animation: fade 1s;
  }
  .shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    40%,
    60% {
      transform: translate3d(0, -5px, 0);
    }
  }
}
</style>
