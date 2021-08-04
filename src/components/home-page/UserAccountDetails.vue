<template>
  <div v-if="loadingUserProfile === false">
    <div class="row q-col-gutter-xl items-center">
      <div class="col-12 col-sm-6 col-xl-6">
        <div class="user-info flex column q-col-gutter-lg">
          <div class="picture">
            <q-img
              :src="userProfile.avatar"
              class="picture-content"
            />
          </div>
          <div class="user-details">
            <div class="name text-primary text-bold text-h3">
              {{ userProfile.name }}
            </div>
            <div class="details">
              {{ userProfile.email }}
            </div>
            <div class="details text-grey-5">
              {{ userProfile.bio }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-6">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-lg-6 text-primary text-center">
            <div class="text-h3 text-bold">
              {{ $t('dashboard.homePage.collection') }}
            </div>
            <div class="text-h1 text-bold q-py-xl">
              {{ userItems }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { IUsers } from 'src/models/IUsers';
import { IUser } from 'src/models/IUser';
import AlgoButton from '../common/Button.vue';
import UserUtils from 'src/helpers/user';

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
export default class UserAccountDetails extends Vue {
  user: IUser = {
    id: '1',
    name: 'Natasha',
    email: 'natasha.k@gmail.com',
    age: '27 years',
    interests: 'abstract, modern, digital, fractal, urban, classic',
    collections: 8,
  };

  userProfile: IUsers[] = [];
  loadingUserProfile: boolean = true;

  userItems = '0';
  loadingUserItems: boolean = true;

  balance: number = 0;

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
    const route = this.$route.query.customProfile;
    void this.$store.dispatch({
      type: 'user/getUserProfile',
      account: route,
    }).then(() => {
      this.loadingUserProfile = false;
      this.userProfile = this.$store.state.user.userProfile;
    });
  }

  getUserItems() {
    const route = this.$route.query.customProfile;
    void this.$store.dispatch({
      type: 'collections/getUserItems',
      account: route,
    }).then(() => {
      this.loadingUserItems = false;
      this.userItems = this.$store.state.collections.userItems;
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

    .country-flag {
      display: inline-flex;
      align-items: center;

      img {
        display: block;
        height: 20px;
        margin-right: 6px;
      }
    }
  }
}
.btn-edit{
   @media (max-width: $breakpoint-xs-max){
    width: 100%;
   }
}
</style>
