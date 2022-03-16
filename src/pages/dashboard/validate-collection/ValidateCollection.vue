<template>
  <div v-if="checkar" class="q-pa-md">
    <div
      v-for="(collection, index) in formCollection"
      :key="index"
    >
      <Collections :collection="collection" :descriptions="descriptions" @check="check" />
    </div>
  </div>
  <div v-else>
    <PreviewValidate :id="idCo" @close="close" />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import Collections from '../../collectible/Collections.vue'
import ICollection from 'src/models/ICollection';
import AlgoButton from 'components/common/Button.vue';
import PreviewValidate from './PreviewValidate.vue';

@Options({
  components: {
    Collections,
    AlgoButton,
    PreviewValidate
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      isConnected: 'isConnected',
    }),
  },
})

export default class ValidateCollection extends Vue {
    descriptions: boolean = false;
    checkar: boolean = true;
    idCo!: string;

    check(id: string) {
      this.checkar = false;
      this.idCo = id
    }

    close() {
      this.checkar = true
    }

    formCollection: ICollection[] = [];
    formPreview: ICollection[] = [];

    get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return this.$store.getters['user/account'];
    }

    mounted() {
      void this.getCollection();
    }

    goApp(name: string) {
      const nameCollection = name.replace(/\0/g, '')
      this.$router.push(`/create-collectible/new-painting/${nameCollection}`).catch(console.error);
    }

    getCollection() {
      void this.$store.dispatch({
        type: 'mint/collectionsVerify',
      }).then(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const collection = this.$store.getters['mint/GET_COLLECTIONS_VERIFY'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        // this.userOnSale = customValeu.data;
        this.formCollection = collection.data
      });
    }
}
</script>

<style scoped>
.container-avatar{
    width: 200px;
     display: block;
    justify-content: center;
}
.img{
    display: flex;
    justify-content: center;
    width: 210px;
    height: 210px;
    border-radius: 50%;
}
.description{
    width: 500px;
    margin-top: 88px;

}
.btn{
    margin-top: 150px;
}

  @media(max-width: 889px) {
    .description{
      margin-top: 0
    }
    .btn{
      margin-top: 0;
      margin-bottom: 15px;
    }
  }

    @media(max-width: 500px) {
    .description{
      margin-top: 0
    }
    .btn{
      margin-top: 0;
      margin-bottom: 15px;
    }
  }
</style>
