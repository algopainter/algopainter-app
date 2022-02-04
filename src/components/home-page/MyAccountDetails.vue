<template>
  <div v-if="isConnected">
    <div v-if="loadingUserItems === false && loadingProfile === false">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-sm-6 col-xl-6">
          <div class="user-info flex column q-col-gutter-lg">
            <div class="picture">
              <q-img
                v-if="profile.avatar != null"
                :src="profile.avatar"
                class="picture-content"
              />
              <q-img
                v-else
                src="/images/do-utilizador (1).png"
                class="picture-content"
              />
            </div>
            <div class="user-details">
              <div
                class="text-account text-primary text-bold text-h3"
              >
                {{ profile.name }}
                <q-tooltip
                  anchor="top middle"
                  self="top middle"
                  class="bg-primary"
                  :offset="[10, 10]"
                >
                  {{ $t(profile.name) }}
                </q-tooltip>
              </div>
              <div class="text-account details text-email">
                {{ profile.email }}
                <q-tooltip
                  anchor="top middle"
                  self="top middle"
                  class="bg-primary"
                  :offset="[10, 10]"
                >
                  {{ $t(profile.email) }}
                </q-tooltip>
              </div>
              <div
                v-if="profile.bio === null || profile.bio === undefined || profile.bio.length < 140"
                class="text-bio details text-grey-5 text-subtitle2"
              >
                {{ profile.bio }}
              </div>
              <div
                v-else
                class="text-subtitle2 card-bio q-pa-none"
              >
                <div
                  class="expanded text-subtitle2 card-bio q-pa-none"
                >
                  {{ sliceBio() }}
                  <a
                    v-if="expanded === false"
                    target="_blank"
                    class="read-more"
                    @click="expanded = !expanded"
                  >
                    {{ $t('dashboard.homePage.btnBioFalse') }}
                  </a>
                  <a
                    v-if="expanded === true"
                    target="_blank"
                    class="read-more"
                    @click="expanded = !expanded"
                  >
                    {{ $t('dashboard.homePage.btnBioTrue') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="row q-pt-lg q-col-gutter-md">
            <div class="col-6 col-sm-auto btn-edit">
              <algo-button
                class="full-width btn-edit"
                size="lg"
                color="primary"
                to="/edit-profile/editProfile"
              >
                {{ $t('dashboard.homePage.editAccount') }}
              </algo-button>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-6">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-lg-6 text-primary text-center">
              <div class="text-h3 text-bold">
                {{ $t('dashboard.homePage.items') }}
              </div>
              <div class="text-h1 text-bold q-py-xl">
                {{ userItems + userOnSale }}
              </div>
            </div>
            <div class="col-12 col-lg-6 text-secondary text-center">
              <div
                class="text-h3 text-bold q-py-md"
              >
                {{ $t(`dashboard.algop`) }} {{ formattedBalance() }}
                <q-tooltip
                  v-if="isConnected"
                  anchor="top middle"
                  self="top middle"
                  class="bg-primary"
                  :offset="[7, 7]"
                >
                  {{ $t(`dashboard.algop`) }} {{ balance }}
                </q-tooltip>
              </div>
              <algo-button
                size="lg"
                color="primary"
                type="a"
                href="https://pancakeswap.finance/swap?outputCurrency=0xbee554dbbc677eb9fb711f5e939a2f2302598c75"
                target="_blank"
              >
                {{ $t('dashboard.homePage.buyAlgop') }}
              </algo-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <AccountDetailsSkeleton />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { IProfile } from 'src/models/IProfile';
import AlgoButton from '../common/Button.vue';
import UserUtils from 'src/helpers/user';
import AccountDetailsSkeleton from 'src/components/home-page/user-gallery-overview/AccountDetailsSkeleton.vue';

@Options({
  components: {
    AlgoButton,
    AccountDetailsSkeleton,
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
export default class AccountDetails extends Vue {
  profile: IProfile = {};
  loadingProfile: boolean = true;

  userItems = '0';
  userOnSale: string = '0';
  loadingUserItems: boolean = true;

  balance: number = 0;

  expanded: boolean = false;

  bioInic: string = '';

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  get accountAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  @Watch('accountAddress')
  onPropertyChanged() {
    void this.getProfile();
    void this.getUserItems();
    void this.setAccountBalance();
    void this.getUserOnSale();
  }

  mounted() {
    void this.setAccountBalance();
    this.formattedBalance();
    void this.getProfile();
    void this.getUserOnSale();
    void this.getUserItems();
  }

  getProfile() {
    this.loadingProfile = true;
    if (this.isConnected === true) {
      void this.$store.dispatch({
        type: 'user/getProfile',
        account: this.accountAddress,
      }).then(() => {
        this.loadingProfile = false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.profile = this.$store.getters['user/GET_PROFILE'] as IProfile;
        this.sliceBio();
      });
    }
  }

  getUserItems() {
    this.loadingUserItems = true;
    if (this.isConnected === true) {
      void this.$store.dispatch({
        type: 'collections/getUserItems',
        account: this.accountAddress,
        page: 1,
        perPage: '9',
      }).then(() => {
        this.loadingUserItems = false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.userItems = this.$store.getters['collections/GET_USER_ITEMS'] as string;
      });
    }
  }

  getUserOnSale() {
    if (this.isConnected === true) {
      void this.$store.dispatch({
        type: 'collections/getUserOnSale',
        account: this.accountAddress,
        page: 1,
        perPage: '9',
        collectionName: '',
        currentCollection: '',

      }).then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const onSales = this.$store.getters['collections/GET_USER_ON_SALE'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.userOnSale = onSales.count;
      });
    }
  }

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
    }
  }

  formattedBalance() {
    if (this.isConnected) {
      return UserUtils.formatAccountBalance(this.balance, 2);
    } else {
      return null;
    }
  }

  sliceBio(): string {
    const bio = this.profile.bio as string;
    if (!this.expanded) {
      const bioInic = bio?.slice(0, 139);
      return bioInic;
    } else {
      return bio;
    }
  }
}
</script>

<style lang="scss" scoped>

.user-info {
  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
    justify-content: center;
  }

  .picture-content {
    border-radius: 100rem;
    height: 230px;
    width: 230px;
  }

  .user-details {
    .details {
      font-size: 1.3rem;
    }
  }
}
.btn-edit{
  margin-left: 26px;
   @media (max-width: $breakpoint-xs-max){
    width: 100%;
    margin-left: 1px;
   }
}

.text-account {
  @media (max-width: $breakpoint-md){
    max-width: 40vw;
  }
  @media (max-width: $breakpoint-xs-max){
    max-width: 75vw;
  }
  max-width: 600px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

}

.text-bio{
  max-width: 100%;
  color: #f4578f;
  word-wrap: break-all;
  color: #BDBDCC;
}

.expanded {
  word-wrap: break-word !important;
}

.read-more{
  cursor: pointer;
  color: black;
  font-weight: bold;
  text-decoration: underline;
}

.text-account {
  @media (max-width: $breakpoint-md){
    max-width: 40vw;
  }
  @media (max-width: $breakpoint-xs-max){
    max-width: 75vw;
  }
  max-width: 600px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #BDBDCC;
}

.card-bio{
  @media (max-width: $breakpoint-md){
    max-width: 40vw;
  }
  @media (max-width: $breakpoint-xs-max){
    max-width: 75vw;
    padding-right: 10px;
  }

  max-width: 600px;;
  text-align: justify;
  word-wrap: normal;
  color: #BDBDCC;
}

.text-email{
  color: black;
}

</style>
