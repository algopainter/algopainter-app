<template>
  <div class="highest-bid row">
    <div class="col-auto q-pr-md row items-center">
      <div v-if="user.customProfile || user.account">
        <router-link
          :to="{name: 'customUrl', params: { customUrl: user.customProfile || user.account } }"
        >
          <q-avatar
            size="44px"
            round
          >
            <img :src="user.avatar || '/placeholder-images/do-utilizador.png'">
          </q-avatar>
        </router-link>
      </div>
      <div v-else>
        <q-avatar
          size="44px"
          round
        >
          <img :src="user.avatar || '/placeholder-images/do-utilizador.png'">
        </q-avatar>
      </div>
    </div>
    <div class="col row items-center user-type">
      <div class="col-12">
        {{ title }}
      </div>
      <div class="col-12 text-primary user-name">
        {{ user.name || formatedAccount }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import UserUtils from 'src/helpers/user';
import { IUser } from 'src/models/IUser';

@Options({
  components: {
  },
})
export default class AuctionUserCard extends Vue {
  @Prop({ required: true }) user!: IUser;
  @Prop({ required: true }) title!: string;

  get formatedAccount() {
    return UserUtils.formatedAccount(this.user.account);
  }
}
</script>

<style lang="scss" scoped>
.highest-bid {
  padding: 6px;
  border-radius: 12px;

  &:hover {
    background: $grey-2;
    cursor: pointer;
  }
}

.user-type {
  font-weight: bold;
  font-size: 1.2rem;
}

.user-name {
  font-weight: bold;
  font-size: 1rem;
}
</style>
