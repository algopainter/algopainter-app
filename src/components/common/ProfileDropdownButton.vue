<template>
  <div>
    <algo-button
      :label="formatedAccount()"
      color="primary"
      outline
      class="text-bold"
    >
      <q-menu>
        <div class="q-pa-md">
          <div class="text-bold q-mb-md">{{ formatedAccount() }}</div>
          <q-list>
            <q-item v-ripple class="q-pl-none">
              <q-item-section avatar>
                <q-avatar>
                  <img src="/images/ALGOP.svg" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>
                  {{ $t('dashboard.balance') }}
                </q-item-label>
                <q-item-label class="text-bold">
                  {{
                    $t('dashboard.tokenBalance', {
                      amount: formatAccountBalance(),
                      token: 'ALGOP',
                    })
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item class="q-pl-none">
              <q-item-section>
                <div class="flex">
                  <div
                    @click="goToProfilePage"
                    class="text-bold cursor-pointer"
                  >
                    {{ $t('dashboard.editProfileTerm') }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item class="q-pa-none q-pt-md">
              <q-item-section>
                <algo-button
                  :label="
                    $t('dashboard.buyToken', {
                      token: '$ALGOP',
                    })
                  "
                  type="a"
                  color="primary"
                  href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xbee554dbbc677eb9fb711f5e939a2f2302598c75"
                  target="_blank"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-menu>
    </algo-button>
  </div>
</template>

<script lang="ts">
import AlgoButton from 'components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';
import UserUtils from 'src/helpers/user';

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    accountAddress: '',
  },
  watch: {
    accountAddress: ['setAccountBalance'],
  },
})
export default class ProfileDropdownButton extends Vue {
  balance: number = 0;

  get accountAddress() {
    return this.$store.state.user.account;
  }

  mounted() {
    void this.setAccountBalance();
  }

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account'])
      );
    }
  }

  formatedAccount() {
    return UserUtils.formatedAccount(this.accountAddress as string);
  }

  formatAccountBalance() {
    return UserUtils.formatAccountBalance(this.balance, 2);
  }

  async goToProfilePage() {
    await this.$router.push('/edit-profile');
  }
}
</script>
