<template>
  <div>
    <q-button>
      <div class="q-gutter-xs row">
        <q-chip
          size="18px"
          color="primary"
          text-color="white"
          class="text-h6"
          clickable
        >
          <q-avatar size="41px">
            <img
              class="profile-img"
              :src="userProfile.avatar || '/placeholder-images/do-utilizador.png'"
            >
          </q-avatar>
          <div class="profile-chip">
            {{
              (userProfile &&
                userProfile.name &&
                userProfile.name.split(' ')[0]) ||
                formatedAccount(4, -4)
            }}
          </div>
        </q-chip>
      </div>
      <q-menu>
        <div class="q-pa-md">
          <div class="text-bold q-mb-md">
            {{ formatedAccount(4, -4) }}
          </div>
          <q-list>
            <q-item
              v-ripple
              class="q-pl-none"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="userProfile.avatar || '/placeholder-images/do-utilizador.png'">
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
                    class="text-bold cursor-pointer"
                    @click="goToProfilePage"
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
                  href="https://pancakeswap.finance/swap?outputCurrency=0xbee554dbbc677eb9fb711f5e939a2f2302598c75"
                  target="_blank"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-menu>
    </q-button>
  </div>
</template>

<script lang="ts">
import AlgoButton from 'components/common/Button.vue';
import { Options, Vue } from 'vue-class-component';
import UserUtils from 'src/helpers/user';
import UserController from 'src/controllers/user/UserController';
import { IProfile } from 'src/models/IProfile';
import { Watch } from 'vue-property-decorator';

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

  get accountAddress() {
    return this.$store.state.user.account;
  }

  mounted() {
    void this.loadUserProfile();
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.setAccountBalance();
    }
  }

  @Watch('accountAddress')
  onPropertyChanged() {
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
      this.userProfile = {};
      console.log('error - loadUserProfile ');
    } else if ((result.getValue() as IProfile)._id) {
      this.userProfile = result.getValue() as IProfile;
    } else {
      this.userProfile = {};
    }
  }

  formatedAccount(inital: number, final: number) {
    return UserUtils.formatedAccount(
      this.accountAddress as string,
      inital,
      final,
    );
  }

  formatAccountBalance() {
    return UserUtils.formatAccountBalance(this.balance, 2);
  }

  async goToProfilePage() {
    await this.$router.push('/edit-profile');
  }
}
</script>
<style lang="scss" scoped>
.profile-chip {
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-img {
  border: 3px solid #fff;
  border-radius: 34px !important;
  background: #fff;
}
</style>
