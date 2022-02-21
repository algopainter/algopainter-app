<template>
  <div id="screenThree" class="q-pb-xl q-px-xl q-pt-md items-center justify-center row">
    <img
      src="../../assets/landing-page/ExpressionsArt.png"
      class="col-6 img-expressions-art"
    >
    <div class="col-6 content-container">
      <p class="text-bold title">{{ $t('dashboard.landingPage.screenThree.title') }}</p>
      <h4 class="primary text-bold q-pb-md subtitle">{{ $t('dashboard.landingPage.screenThree.highlight') }}</h4>
      <p class="text-bold q-pb-md"><q-icon name="mdi-chevron-right" class="i-chevron" /> {{ $t('dashboard.landingPage.screenThree.listItemOne') }}</p>
      <p class="text-bold q-pb-md"><q-icon name="mdi-chevron-right" class="i-chevron" /> {{ $t('dashboard.landingPage.screenThree.listItemTwo') }}</p>
      <p class="text-bold q-pb-md"><q-icon name="mdi-chevron-right" class="i-chevron" /> {{ $t('dashboard.landingPage.screenThree.listItemThree') }}</p>
      <algo-button
        :label="$t('dashboard.landingPage.screenThree.btn')"
        color="primary"
        :to="'create-collectible'"
      />
    </div>
  </div>
</template>
<script lang="ts">
import AlgoButton from '../../components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    AlgoButton,
  },
})

export default class ScreenThree extends Vue {

}
</script>"

<style lang="scss" >
    #screenThree {
        .q-btn {
            min-width: 0px;
        }
    }
</style>

<style lang="scss" scoped>
    p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    .primary {
        color: $primary;
    }

    .tertiary {
        color: $tertiary;
    }

    #screenThree {
        height: 100vh;
        width: 100vw;
        background: url(../../assets/landing-page/BgPrimary.png);
        .img-expressions-art {
            width: 500px;
            height: 500px;
        }

        .subtitle {
            line-height: 57px;
        }
    }

    @media (max-width: 1100px) {
        #screenThree {
            .img-expressions-art {
                width: 450px;
                height: 450px;
            }
        }
    }

    @media (max-width: 1000px) {
        #screenThree {
            .img-expressions-art {
                width: 400px;
                height: 400px;
            }
        }
    }

    @media (max-width: 900px) {
        #screenThree {
            .img-expressions-art {
                width: 375px;
                height: 375px;
            }
        }
    }

    @media (max-width: 750px) {
        #screenThree {
            .img-expressions-art {
                width: 375px;
                height: 375px;
            }

            .content-container {
                width: 100%;
            }
        }
    }

    @media (max-width: 650px) {
        #screenThree {
            padding: 16px 36px 36px;

            .subtitle {
                line-height: 40px;
            }
        }
    }

    @media (max-width: 500px) {
        #screenThree {
            padding: 16px 36px 36px;

            .subtitle {
                font-size: 1.6rem;
            }

            .content-container p {
                font-size: 11px;
            }
        }
    }

    @media (max-width: 450px) {
        #screenThree {
            .img-expressions-art {
                width: 325px;
                height: 325px;
            }
        }
    }

    @media (max-width: 400px) {
        #screenThree {
            .img-expressions-art {
                width: 300px;
                height: 300px;
            }
        }
    }

    @media (max-width: 375px) {
        #screenThree {
            .img-expressions-art {
                width: 275px;
                height: 275px;
            }
        }
    }

    @media (max-width: 350px) {
        #screenThree {
            padding: 16px 24px 24px;
        }
    }

    @media (max-width: 325px) {
        #screenThree {
            .img-expressions-art {
                width: 250px;
                height: 250px;
            }
        }
    }

    @media (max-width: 300px) {
        #screenThree {
            .img-expressions-art {
                width: 225px;
                height: 225px;
            }
        }
    }
</style>