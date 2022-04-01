<template>
  <div
    class="fullscreen text-primary text-center q-pa-md flex flex-center q-pa-md"
  >
    <div>
      <div
        class="text-h2"
        style="opacity:.4"
      >
        {{ $t('dashboard.errorPage.user') }}
      </div>

      <algo-button
        :label="$t('dashboard.errorPage.btn')"
        color="primary"
        outline
        class="q-mt-xl"
        :to="'/'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';

@Options({
  components: {
    AlgoButton,
  },
})
export default class NoUserFound extends Vue {
}
</script>

<style scoped>

</style>
