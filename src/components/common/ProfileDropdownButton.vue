<template>
  <div class="profile-dropdown-button-container">
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
      <q-menu
        :offset="[50, 10]"
      >
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
                      amount: formattedAccountBalance,
                      token: 'ALGOP',
                    })
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-expansion-item
              expand-separator
              default-opened
              header-class="text-bold"
              label="Profile"
            >
              <q-list>
                <q-item v-close-popup clickable @click="goToProfilePage">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.editProfileTerm') }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="goToEarningsReport">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.homePage.earningsReport') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-separator />
            <q-expansion-item
              expand-separator
              header-class="text-bold"
              default-opened
              label="Collections"
            >
              <q-list>
                <q-item v-close-popup clickable @click="registerCollection">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.registerCollection') }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click="registerExternalNFT">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.header.registerExternal') }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="collectionOwner" v-close-popup clickable @click="report">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.reportCollection') }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="haveAccount.length > 0" v-close-popup clickable @click="goToApproveCollection">
                  <q-item-section>
                    <q-item-label>{{ $t('dashboard.approveCollection') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
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
import { api } from 'src/boot/axios';

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
  collectionOwner: boolean = false;
  haveAccount: string = '';
  filterAccount!: string[] | undefined;

  get accountAddress() {
    return this.$store.state.user.account;
  }

  get formattedAccountBalance() {
    return UserUtils.formatAccountBalance(this.balance, 2);
  }

  mounted() {
    void this.loadUserProfile();
    void this.checkAccount();
    void this.setAccountBalance();
    void this.reportCollection()
  }

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.$store.getters['user/isConnected'];
  }

  @Watch('isConnected')
  onIsConnectedChanged() {
    if (this.isConnected) {
      void this.checkAccount();
      void this.setAccountBalance();
      void this.reportCollection()
    }
  }

  @Watch('accountAddress')
  onPropertyChanged() {
    void this.checkAccount();
    void this.loadUserProfile();
    void this.reportCollection()
  }

  async setAccountBalance() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.balance = await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']);
  }

  async loadUserProfile() {
    const result = await this.userController.getUserProfile(
      this.accountAddress?.toLowerCase() as string,
    );
    if (result.isFailure) {
      this.userProfile = {};
      console.log('User has not created a profile');
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

  async goToProfilePage() {
    await this.$router.push('/edit-profile/' + 'editProfile');
  }

  async goToEarningsReport() {
    await this.$router.push('/report-earnings')
  }

  async goToApproveCollection() {
    await this.$router.push('/validate-collection')
  }

  checkAccount() {
    this.haveAccount = ''
    const arrayAccount = process.env.ALGOPAINTER_APPROVERS?.split(',')
    this.filterAccount = arrayAccount?.map((account) => {
      if (account.toLowerCase() === this.accountAddress?.toLowerCase()) {
        this.haveAccount = account
      }
      return account
    });
  }

  async registerCollection() {
    const result = await this.userController.getUserProfile(
      this.accountAddress?.toLowerCase() as string,
    );
    if (result.isFailure) {
      this.$q.notify({
        type: 'negative',
        message: this.$t(
          'dashboard.createCollection.hasNoProfile'
        ),
      });
      await this.$router.push('/edit-profile/' + 'registerCollection');
    } else {
      await this.$router.push('/create-collection');
    }
  }

  async registerExternalNFT() {
    await this.$router.push('/register-nft');
  }

  async report() {
    await this.$router.push('/report-collection')
  }

  async reportCollection() {
    const accountAddress = this.accountAddress?.toLowerCase() as string;
    const result = await api.get(`collections?owner=${accountAddress}`);
    if (result.data.length > 0) {
      this.collectionOwner = true;
    } else {
      this.collectionOwner = false;
    }
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
.profile-dropdown-button-container {
  display: flex;
  align-items: center;
}
.btn-drop{
  width: 100%;
}
</style>
