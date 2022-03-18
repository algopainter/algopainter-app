<template>
  <div
    v-if="loading"
    class="spinner-container"
  >
    <q-spinner
      color="primary"
      size="60px"
      class="text-center"
    />
  </div>
  <div v-else-if="!verify && formCollection.length > 0" class="q-pa-md">
    <div
      v-for="(collection, index) in formCollection"
      :key="index"
    >
      <collections :collection="collection" :descriptions="descriptions" @check="check" />
    </div>
  </div>
  <div
    v-else-if="formCollection.length === 0"
    class="no-data"
  >
    {{ $t('dashboard.verifyCollection.noData') }}
  </div>
  <div v-else>
    <preview-validate :id="idCo" @close="close" />
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
  idCo!: string;
  verify: boolean = false;
  formCollection: ICollection[] = [];
  formPreview: ICollection[] = [];
  loading: boolean = false;

  async mounted() {
    await this.getCollection();
  }

  async getCollection() {
    this.loading = true;

    await this.$store.dispatch({
      type: 'mint/collectionsVerify',
    }).then(() => {
      this.formCollection = this.$store.getters['mint/GET_COLLECTIONS_VERIFY'] as ICollection[];

      this.loading = false;
    });
  }

  check(id: string) {
    this.idCo = id
    this.verify = true;
  }

  async close() {
    await this.getCollection();
    this.verify = false;
  }

  get account() {
    return this.$store.getters['user/account'] as string;
  }

  goApp(name: string) {
    const nameCollection = name.replace(/\0/g, '')
    this.$router.push(`/create-collectible/new-painting/${nameCollection}`).catch(console.error);
  }
}
</script>

<style scoped>
  .container-avatar {
    width: 200px;
    display: block;
    justify-content: center;
  }

  .img {
    display: flex;
    justify-content: center;
    width: 210px;
    height: 210px;
    border-radius: 50%;
  }

  .description {
    width: 500px;
    margin-top: 88px;
  }

  .btn {
    margin-top: 150px;
  }

  .no-data {
    font-weight: bold;
    font-size: 22px;
    color: #F4538D;
    text-align: center;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
  }

  @media(max-width: 889px) {
    .description {
      margin-top: 0
    }

    .btn {
      margin-top: 0;
      margin-bottom: 15px;
    }
  }

  @media(max-width: 500px) {
    .description {
      margin-top: 0
    }

    .btn {
      margin-top: 0;
      margin-bottom: 15px;
    }
  }
</style>
