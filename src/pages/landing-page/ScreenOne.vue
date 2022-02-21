<template>
  <div id="screenOne" class="q-pb-xl q-px-xl q-pt-md items-center">
    <div class="row justify-between">
      <div class="row items-center header-left">
        <img
          class="logo"
          src="../../assets/landing-page/AlgoPainterLogo.png"
        >
        <h5 class="text-bold q-pl-sm header-text">{{ $t('dashboard.landingPage.screenOne.logo') }}</h5>
      </div>
      <algo-button
        :label="$t('dashboard.landingPage.screenOne.btn1Title')"
        color="primary"
        class="btn-create"
        :to="'/edit-profile/editProfile'"
      />
    </div>
    <div class="row q-pt-xl items-center justify-center full-height">
      <div class="col-6 content-container">
        <h3 class="primary text-bold q-pb-lg title">{{ $t('dashboard.landingPage.screenOne.title') }}</h3>
        <h6 class="text-bold q-pb-sm subtitle">{{ $t('dashboard.landingPage.screenOne.subtitle') }}</h6>
        <p class="tertiary q-pb-lg comment">{{ $t('dashboard.landingPage.screenOne.text') }}</p>
        <algo-button
          :label="$t('dashboard.landingPage.screenOne.btn2Title')"
          color="primary"
          :to="'create-collectible'"
        />
      </div>
      <img
        src="../../assets/landing-page/Notebook.png"
        class="col-6 img-notebook"
      >
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

export default class ScreenOne extends Vue {

}
</script>"

<style lang="scss" >
    #screenOne {
        .q-btn {
            min-width: 0px;
        }
    }

    @media (max-width: 380px) {
        #screenOne {
            .q-btn {
                font-size: 10px;
            }
        }
    }

    @media (max-width: 340px) {
        #screenOne {
            .q-btn {
                font-size: 7px !important;
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

    #screenOne {
        height: 100vh;
        width: 100vw;
        background: url(../../assets/landing-page/BgPrimary.png);
        .title {
            line-height: 64px;
        }

        .img-notebook {
            width: 640px;
            height: 480px;
        }
    }

    @media (max-width: 1400px) {
        #screenOne {
            .title {
                font-size: 2.5rem;
            }
            .img-notebook {
                width: 480px;
                height: 360px;
            }
        }
    }

    @media (max-width: 1100px) {
        #screenOne {
            .title {
                font-size: 2.0rem;
                line-height: 48px;
            }

            .subtitle {
                font-size: 1.0rem;
            }

            .img-notebook {
                width: 360px;
                height: 270px;
            }
        }
    }

    @media (max-width: 850px) {
        #screenOne {
            .title {
                font-size: 2.0rem;
                line-height: 48px;
            }

            .content-container {
                width: 100%;
            }

            .subtitle {
                font-size: 1.0rem;
                line-height: 1.5rem;
            }

            .img-notebook {
                width: 480px;
                height: 360px;
            }
        }
    }

    @media (max-width: 650px) {
        #screenOne {
            .title {
                font-size: 1.2rem;
                line-height: 25px;
            }

            .content-container {
                width: 100%;
            }

            .subtitle {
                font-size: 0.75rem;
                line-height: 1.2rem;
            }

            .comment {
                font-size: 11px;
                line-height: 1.2rem;
            }

            .img-notebook {
                width: 360px;
                height: 270px;
            }
        }
    }

    @media (max-width: 500px) {
        #screenOne {
            padding: 16px 36px 36px;

            .img-notebook {
                width: 270px;
                height: 202.5px;
            }
            .header-left {
                .header-text {
                    font-size: 1rem;
                }
            }
        }
    }

    @media (max-width: 380px) {
        #screenOne {
            .img-notebook {
                width: 202.5px;
                height: 152px;
            }

            .btn-create {
                font-size: 10px;
            }
        }
    }

    @media (max-width: 350px) {
        #screenOne {
            padding: 16px 24px 24px;
        }
    }

    @media (max-width: 340px) {
        #screenOne {
            .header-left {
                .header-text {
                    font-size: 0.7rem;
                }
            }

            .logo {
                width: 40px;
                height: 40px;
            }
        }
    }

</style>