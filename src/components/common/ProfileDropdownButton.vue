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
import AlgoPainterTokenProxy from 'src/eth/AlgoPainterTokenProxy';
import AlgoButton from 'components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    isConnected: false,
    accountAddress: '',
  },
  watch: {
    isConnected: ['setAccountBalance'],
    accountAddress: ['setAccountBalance'],
  },
})
export default class ProfileDropdownButton extends Vue {
  balance: string = '';

  get isConnected() {
    return this.$store.state.user.isConnected;
  }

  get accountAddress() {
    return this.$store.state.user.account;
  }

  mounted() {
    this.setAccountBalance();
  }

  setAccountBalance() {
    if (this.isConnected) {
      void this.fetchAccountBalance();
    }
  }

  formatedAccount() {
    const a = this.accountAddress as string;
    const splited = a.split('');
    return splited.slice(0, 11).join('') + '...' + splited.slice(-4).join('');
  }

  formatAccountBalance() {
    return parseInt(this.balance);
  }

  async goToProfilePage() {
    await this.$router.push('/edit-profile');
  }

  async fetchAccountBalance() {
    const algopainter = new AlgoPainterTokenProxy(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.$store.getters['user/networkInfo']
    );
    this.balance = (await algopainter.balanceOf(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.$store.getters['user/account']
      )) as string
    ).toString();
  }
}
</script>
