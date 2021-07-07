<template>
  <div class="text-h6">
    {{ $t('createCollectible.create.example') }}
    <section
      v-if="exampleImg === '' "
      class="row text-h6 ap-preview-box justify-center items-center"
    >
      <p class="text-center">
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
        <p class="text-center text-bold">
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
        <p class="text-center text-bold">
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
        <p class="text-center text-bold">
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
    <algo-button
      class="full-width"
      color="primary"
      disable
      outline
      :label="$t('createCollectible.create.goToArtist')"
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
  height: 60vh;
  width: 400px;
  box-sizing: border-box;
  border-radius: 10px;
}

span, p {
    font-size: 15px;
}
</style>
