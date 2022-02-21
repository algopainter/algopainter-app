<template>
  <div id="screenTwo" class="q-pa-xl items-center text-center">
    <h4 class="primary text-bold title">{{ $t('dashboard.landingPage.screenTwo.title') }}</h4>
    <div class="row q-pt-xl justify-center items-center full-height content-container">
      <div class="row text-container">
        <div class="q-pr-sm col-6">
          <p>{{ $t('dashboard.landingPage.screenTwo.textLeftOne') }}</p>
          <br>
          <p>{{ $t('dashboard.landingPage.screenTwo.textLeftTwo') }}</p>
          <br>
          <p>{{ $t('dashboard.landingPage.screenTwo.textLeftThree') }}</p>
        </div>
        <div class="q-pl-sm col-6">
          <p>{{ $t('dashboard.landingPage.screenTwo.textRightOne') }}</p>
          <br>
          <p>{{ $t('dashboard.landingPage.screenTwo.textRightTwo') }}</p>
          <br>
          <p>{{ $t('dashboard.landingPage.screenTwo.textRightThree') }}</p>
          <br>
          <p>{{ $t('dashboard.landingPage.screenTwo.textRightFour') }}</p>
        </div>
      </div>
      <h5 class="primary text-bold text-center subtitle">{{ $t('dashboard.landingPage.screenTwo.highlight') }}</h5>
      <algo-button
        :label="$t('dashboard.landingPage.screenTwo.btn')"
        color="primary"
        :to="'create-collection'"
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

export default class ScreenTwo extends Vue {

}
</script>"

<style lang="scss" >
    #screenTwo {
        .q-btn {
            min-width: 0px;
        }
    }

    @media (max-width: 380px) {
        #screenTwo {
            .q-btn {
                font-size: 10px;
            }
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

    #screenTwo {
        height: 100vh;
        width: 100vw;
        background-color: #030017;

        .text-container p {
            color: #ffffff;
        }
    }

    @media (max-width: 700px) {
        .title {
            font-size: 1.6rem;
        }

        .text-container p {
            font-size: 10.5px;
        }

        .subtitle {
            font-size: 1.15rem;
        }
    }

    @media (max-width: 500px) {
        #screenTwo {
            padding: 16px 36px 36px;
        }
    }

    @media (max-width: 450px) {
        .content-container {
            padding: 12px;

            .text-container p {
                font-size: 9.0px;
            }

            .subtitle {
                font-size: 0.9rem;
                line-height: 1.2rem;
            }
        }
    }

    @media (max-width: 350px) {
        #screenTwo {
            padding: 16px 24px 24px;

            .text-container p {
                font-size: 8.0px;
            }

            .title {
                font-size: 1.4rem;
            }

            .content-container {
                .subtitle {
                    line-height: 1.2rem;
                }
            }
        }
    }

    @media (max-width: 290px) {
        .title {
            font-size: 1.1rem;
        }

        .content-container {
            padding: 0px;

            .subtitle {
                font-size: 0.7rem;
                line-height: 0.8rem !important;
            }
        }
    }

</style>