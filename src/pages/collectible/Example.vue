<template>
  <div class="col-12 text-h6 q-mb-lg">
    {{ $t('createCollectible.create.example') }}
    <section
      v-if="exampleImg === '' "
      class="row text-h6 ap-preview-box justify-center items-center"
    >
      <p class="text-center textSample">
        {{ $t('createCollectible.create.exampleText') }}
      </p>
    </section>
    <section
      v-else
      class="row text-h6 ap-preview-box justify-center items-center"
    >
      <q-img
        class="img"
        :src="exampleImg"
      />
    </section>

    <div class="row justify-between">
      <section>
        <p class="text-center text-bold q-ma-none">
          {{ batchPrince }}
        </p>
        <q-icon
          color="positive"
          size="md"
          name="account_balance_wallet"
        />
        <span> {{ $t('createCollectible.create.batchPrince') }}</span>
        <p class="text-center">
          {{ $t('createCollectible.create.algoP') }}
        </p>
      </section>
      <section>
        <p class="text-center text-bold q-ma-none">
          {{ remaining }}
        </p>
        <q-icon
          color="positive"
          size="md"
          name="lock_open"
        />
        <span>{{ $t('createCollectible.create.remaining') }}</span>
      </section>
      <section>
        <p class="text-center text-bold q-ma-none">
          {{ minted }}
        </p>
        <q-icon
          color="secondary"
          size="md"
          name="lock"
        />
        <span>{{ $t('createCollectible.create.minted') }}</span>
      </section>
    </div>
    <p
      v-if="btnLink == ''"
      class="text-center text-bold textComing"
      :to="btnLink"
    >
      {{ $t('createCollectible.create.comingSoon') }}
    </p>
    <algo-button
      v-else
      class="btnLink"
      color="primary"
      :label="$t('createCollectible.create.goToArtist')"
      :to="btnLink"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import AlgoButton from '../../components/common/Button.vue';

class Props {
  idBtn = prop({
    type: String,
    required: true,
  });

  exampleImg = prop({
    type: String,
    required: true,
  });

  batchPrince = prop({
    type: String,
    required: true,
  });

  remaining = prop({
    type: String,
    required: true,
  });

  minted = prop({
    type: String,
    required: true,
  });

  btnLink= prop({
    type: String,
    required: true,
  })
}

@Options({
  components: {
    AlgoButton,
  },
})
export default class Example extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
.ap-preview-box {
  padding: 25px 50px 25px 50px;
  border: 2px dashed #f4538d;
  min-height: 450px;
  max-height: 550px;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10px;
}

span, p {
  font-size: 0.7rem;
}
.textComing{
  font-size:1.5rem;
  color: #f4538d;
}

.textSample {
  font-size: 1.3rem;
}

.btnLink {
 width: 100%
}

.img {
  width: 100%;
  height: 20%;
}
</style>
