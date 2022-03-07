<template>
  <div class="row justify-center q-gutter-xl">
    <div class="container-avatar">
      <q-img class="img" :src="collection.avatar">
      </q-img>
      <p class="text-bold text-center"> {{ collection.title }}</p>
    </div>
    <div class="description">
      <p class="text-center">
        {{ collection.description }}
      </p>
      <div v-if="descriptions">
        <collections-description :collection-name="collection.namelc" :collection-id="collection.blockchainId" :collection="collection" />
      </div>
      <div v-else class="row justify-around">
        <div>
          <p class="text-bold">
            {{ $t('createCollectible.create.dateStart') }}
          </p>
          {{ startDT }}
        </div>

        <div>
          <p class="text-bold">
            {{ $t('createCollectible.create.dateEnd') }}
          </p>
          {{ endDT }}
        </div>
      </div>
      <div>
      </div>
    </div>
    <div v-if="descriptions" class="btn">
      <algo-button
        type="submit"
        color="primary"
        label="Go to App"
        @click="goApp(collection.namelc)"
      />
    </div>
    <div v-else class="btn">
      <algo-button
        type="submit"
        color="primary"
        label="Verify"
        @click="verify(collection._id)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { PropType } from 'vue';
import ICollection from 'src/models/ICollection';
import AlgoButton from 'components/common/Button.vue';
import CollectionsDescription from './CollectionsDescription.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { isError } from 'src/helpers/utils';
import { api } from 'src/boot/axios';

interface Aproved {
  collectionId: number;
  approvedBy: string;
  salt: string;
}
class Props {
  collection = prop({
    type: Object as PropType<ICollection>,
    required: true,
  });

  descriptions = prop({
    type: Boolean,
    required: true,
  });
}
@Options({
  components: {
    AlgoButton,
    CollectionsDescription,

  },
  computed: {
    ...mapGetters('user', {
      account: 'account',
    })
  }
})
export default class Collections extends Vue.with(Props) {
  img: string= '/images/gwei.png'

  startDT: string | Date = '';
  endDT : string | Date = '';

  aproved: Aproved = {
    collectionId: 0,
    approvedBy: '',
    salt: '',
  }

  mounted() {
    void this.formatDate()
  }

  verify(id: string) {
    this.$emit('check', id)
  }

  formatDate() {
    if (this.collection.metrics) {
      this.startDT = moment(this.collection.metrics.startDT).format('DD/MM/YYYY hh:mm:ss')
      this.endDT = moment(this.collection.metrics.endDT).format('DD/MM/YYYY hh:mm:ss')
      console.log('date', this.startDT)
    }
  }

  goApp(name: string) {
    const nameCollection = name.replace(/\0/g, '')
    this.$router.push(`/create-collectible/new-painting/${nameCollection}`).catch(console.error);
  }

  async ApproveCollection() {
    try {
      this.aproved.collectionId = this.collection.blockchainId;
      this.aproved.approvedBy = this.$store.getters['user/account'] as string;
      const data = {
        ...this.aproved,
        salt: nanoid(),
      };
      const web3helper = new Web3Helper();
      const userAccount = this.$store.getters['user/account'] as string;
      const signatureOrError = await web3helper.hashMessageAndAskForSignature(data, userAccount);

      if (isError(signatureOrError as Error)) {
        return;
      }

      const request = {
        data,
        signature: signatureOrError,
        account: userAccount,
        salt: data.salt,
      };
      await api.put(`collection/${this.aproved.collectionId}/approve`, request)
      const status = await api.put(`collection/${this.aproved.collectionId}/approve`, request);
      if (status.status === 200) {
        console.log('Sucessoo!')
      } else {
        console.log('FAlhou!')
      }
    } catch (e) {
      this.$q.notify({
        type: 'negative',
        message: 'error Approve',
      });
    }
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