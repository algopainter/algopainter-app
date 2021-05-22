<template>
  <div>
    <div class="row q-col-gutter-xl items-center">
      <div class="col-12 col-sm-6 col-xl-8">
        <div class="user-info flex items-center">
          <div class="picture q-mr-lg">
            <q-img
              src="../../assets/placeholder-images/user.png"
              class="picture-content"
            />
          </div>
          <div class="user-details">
            <div class="name text-primary text-bold text-h3">Natasha</div>
            <div class="details">natasha.k@gmail.com</div>
            <div class="details">27 years</div>
            <div class="details country-flag">
              <img
                src="https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg"
              />
              UK
            </div>
            <div class="details text-grey-5">
              abstract, modern, digital, fractal, urban, classic
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-col-gutter-md">
          <div>
            <algo-button
              size="lg"
              color="primary"
            >
              Edit Account
            </algo-button>
          </div>
          <div>
            <algo-button
              size="lg"
              color="primary"
              outline
            >
              Send New Art
            </algo-button>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-lg-6 text-primary text-center">
            <div class="text-h3 text-bold">Collection</div>
            <div class="text-h1 text-bold q-py-xl">8</div>
          </div>
          <div class="col-12 col-lg-6 text-secondary text-center">
            <div class="text-h3 text-bold">$ALGOP</div>
            <div class="text-h1 text-bold q-py-xl">1.302</div>
            <algo-button
              size="lg"
              color="primary"
            >
              Buy $ALGOP
            </algo-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import AlgoButton from '../common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})
export default class AccountDetails extends Vue {
}
</script>

<style lang="scss" scoped>
.user-info {
  .picture-content {
    border-radius: 100rem;
    height: 230px;
    width: 230px;
  }

  .user-details {
    .details {
      padding: 2px 0;
      font-size: 1.3rem;
    }

    .country-flag {
      display: flex;
      align-items: center;

      img {
        display: block;
        height: 20px;
        margin-right: 6px;
      }
    }
  }
}

</style>
