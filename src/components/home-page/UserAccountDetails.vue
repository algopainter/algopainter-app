
<template>
  <div v-if="loadingUserProfile === false && loadingUserItems === false">
    <div class="row q-col-gutter-xl items-center">
      <div class="col-12 col-sm-7 col-xl-7">
        <div class="user-info flex column q-col-gutter-lg">
          <div class="picture">
            <q-img
              v-if="userProfile.avatar"
              :src="userProfile.avatar"
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
              {{ userProfile.name }}
              <q-tooltip
                anchor="top middle"
                self="top middle"
                class="bg-primary"
                :offset="[10, 10]"
              >
                {{ $t(userProfile.name) }}
              </q-tooltip>
            </div>
            <div class="details text-email">
              {{ userProfile.email }}
              <q-tooltip
                anchor="top middle"
                self="top middle"
                class="bg-primary"
                :offset="[10, 10]"
              >
                {{ $t(userProfile.email) }}
              </q-tooltip>
            </div>
            <div
              v-if="userProfile.bio === null || userProfile.bio === undefined || userProfile.bio.length < 140"
              class="text-subtitle1 card-bio q-pa-none q-my-md"
            >
              {{ userProfile.bio }}
            </div>
            <div
              v-else
              class="text-bold text-subtitle1"
            >
              <div
                class="text-subtitle2 card-bio q-pa-none"
              >
                {{ sliceBio(userProfile.bio) }}
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
      </div>
      <div class="col-12 col-sm-5 col-xl-5 justify-center">
        <div class="col-12 col-lg-6 text-primary text-center">
          <div class="text-h3 text-bold">
            {{ $t('dashboard.homePage.items') }}
          </div>
          <div class="text-h1 text-bold q-py-xl">
            {{ userItems }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <UserAccountDetailsSkeleton />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IProfile } from 'src/models/IProfile';

import AlgoButton from '../common/Button.vue';
import UserUtils from 'src/helpers/user';
import UserAccountDetailsSkeleton from 'src/components/home-page/user-gallery-overview/UserAccountDetailsSkeleton.vue';

@Options({
  components: {
    AlgoButton,
    UserAccountDetailsSkeleton,
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
export default class UserAccountDetails extends Vue {
  userProfile: IProfile = {};
  loadingUserProfile: boolean = true;

  userItems = '0';
  loadingUserItems: boolean = true;

  balance: number = 0;

  expanded: boolean = false;

  bioInic: string = '';
  slicedBio: string = '';

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  get accountAddress() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  mounted() {
    void this.setAccountBalance();
    this.formatedBalance();
    void this.getUserProfile();
    void this.getUserItems();
  }

  getUserProfile() {
    this.loadingUserProfile = true;
    const route = this.$route.params.account;
    void this.$store.dispatch({
      type: 'user/getUserProfile',
      account: route,
    }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userProfile = this.$store.getters['user/GET_USER_PROFILE'] as IProfile;
      if (userProfile === undefined) {
        this.userProfile = {};
      } else {
        this.userProfile = userProfile;
        if (userProfile.bio) {
          this.sliceBio(userProfile.bio);
        }
      }
      this.loadingUserProfile = false;
    });
  }

  getUserItems() {
    const route = this.$route.params.account;
    void this.$store.dispatch({
      type: 'collections/getUserItems',
      account: route,
      page: 1,
      perPage: '9',
    }).then(() => {
      this.loadingUserItems = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.userItems = this.$store.getters['collections/GET_USER_ITEMS'] as string;
    });
  }

  async setAccountBalance() {
    if (this.isConnected) {
      this.balance = (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await UserUtils.fetchAccountBalance(this.$store.getters['user/networkInfo'], this.$store.getters['user/account']));
    }
  }

  formatedBalance() {
    if (this.isConnected) {
      return UserUtils.formatAccountBalance(this.balance, 2);
    } else {
      return null;
    }
  }

  sliceBio(bio: string): string {
    if (!this.expanded) {
      const bioInic = bio.slice(0, 139);
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
      padding: 2px 0;
      font-size: 1.3rem;
    }
  }
}
.btn-edit{
   @media (max-width: $breakpoint-xs-max){
    width: 100%;
   }
}

.text-account {
  @media (max-width: $breakpoint-xs-max){
    max-width: 75vw;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  max-width: 40vw;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 4rem;
}

.text-bio{
  max-width: 100%;
  word-break: break-all;
  color: #BDBDCC;
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
