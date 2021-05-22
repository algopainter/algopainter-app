<template>
  <q-page>
    <div class="account-details q-pa-lg">
      <account-details />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import AccountDetails from '../../components/home-page/AccountDetails.vue';

@Options({
  components: { AccountDetails },
})
export default class HomePage extends Vue {

}
</script>

<style lang="scss" scoped>
.account-details {
  border: 2px dashed $primary;
  border-radius: 20px;
}
</style>
