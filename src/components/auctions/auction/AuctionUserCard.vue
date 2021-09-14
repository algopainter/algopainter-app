<template>
  <div class="highest-bid row">
    <div class="col-auto q-pr-md row items-center">
      <q-avatar
        size="44px"
        round
      >
        <img :src="user.avatar || '/placeholder-images/do-utilizador.png'">
      </q-avatar>
    </div>
    <div class="col row items-center user-type">
      <div class="col-12">
        {{ title }}
      </div>
      <div class="col-12 text-primary user-name">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IUser } from 'src/models/IUser';

@Options({
  components: {
  },
})
export default class AuctionUserCard extends Vue {
  @Prop({ required: true }) user!: IUser;
  @Prop({ required: true }) title!: string;
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
