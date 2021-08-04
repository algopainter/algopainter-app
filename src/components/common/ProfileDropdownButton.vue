<template>
  <div>
    <algo-button
      :label="name || formatedAccount()"
      color="primary"
      outline
      class="text-bold"
    >
      <q-menu>
        <div class="q-pa-md">
          <div class="text-bold q-mb-md">{{ name || formatedAccount() }}</div>
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
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';

@Options({
  components: {
    AlgoButton,
  },
  computed: {
    accountAddress: '',
  },
  watch: {
    accountAddress: ['setAccountBalance', 'loadUserProfile'],
  },
})
export default class ProfileDropdownButton extends Vue {
  balance: number = 0;

  userProfile: IProfile = {};

  userController: UserController = new UserController();

  get name() {
    return this.userProfile.name;
  }

  get accountAddress() {
    return this.$store.state.user.account;
  }

  mounted() {
    void this.setAccountBalance();
    void this.loadUserProfile();
  }

  async setAccountBalance() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.balance = await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']);
  }

  async loadUserProfile() {
    const result = await this.userController.getUserProfile(
      this.accountAddress as string,
    );
    if (result.isFailure) {
      console.log('erro', result);
    } else if ((result.getValue() as IProfile)._id) {
      this.userProfile = result.getValue() as IProfile;
    } else {
      this.userProfile = {};
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
