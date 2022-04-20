<template>
  <h5 class="text-bold">{{ $t('dashboard.registerExternal.title') }}</h5>
  <q-page>
    <q-form>
      <div class="row q-mb-md" style="align-items: center">
        <q-input
          v-model.trim="nftContractAddress"
          :label="$t('dashboard.registerExternal.contractAddress')"
          class="col-6 q-pr-md"
          maxlength="42"
          :rules="[
            (val) =>
              val.length > 0 || $t('dashboard.registerExternal.emptyField'),
            (val) =>
              val.length === 42 ||
              $t('dashboard.registerExternal.notEnoughChars'),
          ]"
        />
        <algo-button
          color="primary"
          :label="$t('dashboard.registerExternal.btnGet')"
          class="q-pl-md"
          :loading="loadingOptions"
          @click="getNftsOptions"
        />
      </div>
      <div
        v-if="nftsActiveIdsList.length > 0 && !loadingOptions"
        class="row q-mb-md"
      >
        <q-select
          v-model="nftAddressList"
          :label="$t('dashboard.registerExternal.nfts')"
          multiple
          :options="nftsOptions"
          :option-disable="
            (opt) => (Object(opt) === opt ? opt.active === false : false)
          "
          :hint="inactiveIdsMsg"
          :hide-hint="nftsInactiveIdsList.length === 0"
          class="col-6 q-pr-md"
        />
        <q-input
          ref="name"
          v-model.trim="nftContractName"
          :label="$t('dashboard.registerExternal.name')"
          class="col-6 q-pl-md"
          :rules="[
            (val) =>
              val.length === 0 || $t('dashboard.registerExternal.emptyField'),
          ]"
          readonly
        />
      </div>
      <div class="row">
        <div
          v-for="(nft, i) in nftAddressList"
          :key="nft"
          class="nft-card col-6"
        >
          <div class="nft-info q-pb-md">
            <p class="label">
              <span class="text-bold">{{
                $t('dashboard.registerExternal.nftId')
              }}</span>
              {{ nftAddressList[i].id }}
            </p>
            <p class="label">
              <span class="text-bold">{{
                $t('dashboard.registerExternal.nftName')
              }}</span>
              {{ nftAddressList[i].name }}
            </p>
            <p v-if="nftAddressList[i].description !== undefined" class="label">
              <span class="text-bold">{{
                $t('dashboard.registerExternal.nftDescription')
              }}</span>
              {{ nftAddressList[i].description }}
            </p>
          </div>
          <div class="nft-img">
            <q-img :src="nftAddressList[i].image" width="100%" height="auto" />
          </div>
        </div>
      </div>
      <error v-if="isWarning" :error-msg="warningMsg">
        <template #icon>
          <q-avatar
            size="60px"
            color="warning"
            class="icon self-center"
            text-color="white"
          >
            <q-icon name="mdi-alert" />
          </q-avatar>
        </template>
      </error>
      <algo-button
        v-if="nftsActiveIdsList.length > 0 && !loadingOptions"
        :disable="nftAddressList.length === 0"
        :loading="loadingRegister"
        color="primary"
        :label="$t('dashboard.registerExternal.btnRegister')"
        class="q-mx-auto q-my-lg flex"
        @click="registerNFTs"
      />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Error from 'src/pages/create-collection/Error.vue';
import { mapGetters } from 'vuex';
import { NetworkInfo } from 'src/store/user/types';
import {
  INftInfo,
  INftDescriptor,
  INftOption,
} from 'src/models/IRegisterExternal';
import AlgoButton from 'src/components/common/Button.vue';
import { QInput } from 'quasar';
import AlgoPainterERC721StubProxy from 'src/eth/ERC721StubProxy';
import { isAddress, toChecksumAddress } from 'web3-utils';
import { multihash } from 'is-ipfs';
import CollectionController, { CreateCollectionByExternalContractRequest, ExternalNFTInfo } from 'src/controllers/collection/CollectionController';

@Options({
  components: {
    Error,
    AlgoButton,
  },
  computed: {
    ...mapGetters('user', ['isConnected', 'networkInfo', 'account']),
  },
})
export default class registerExternalNFT extends Vue {
  declare $refs: {
    name: QInput;
    creator: QInput[];
  };

  isConnected!: boolean;
  networkInfo!: NetworkInfo;
  account!: string;

  erc721Stub!: AlgoPainterERC721StubProxy;

  nftContractAddress: string = '';
  nftAddressList: INftOption[] = [];
  nftContractName: string = '';
  nftInfoList: INftInfo[] = [];
  nftDescriptorList: INftDescriptor[] = [];

  nftsOptions: INftOption[] = [];
  nftsActiveIdsList: number[] = [];
  nftsInactiveIdsList: number[] = [];
  inactiveIdsMsg: string = '';
  loadingOptions: boolean = false;

  isWarning: boolean = false;
  warningMsg: string = '';
  loadingRegister: boolean = false;

  async getNftsOptions() {
    try {
      if (!isAddress(toChecksumAddress(this.nftContractAddress))) {
        this.warningMsg = this.$t('dashboard.registerExternal.invalidAddress');
        this.isWarning = true;
        return;
      }
    } catch (e) {
      this.warningMsg = this.$t('dashboard.registerExternal.invalidAddress');
      this.isWarning = true;
      return;
    }

    this.loadingOptions = true;
    this.isWarning = false;
    this.nftsActiveIdsList = [];
    this.nftsOptions = [];
    this.nftInfoList = [];
    this.nftDescriptorList = [];
    this.nftsInactiveIdsList = [];
    this.nftAddressList = [];
    this.inactiveIdsMsg = '';
    this.nftContractName = '';

    // this.nftContractAddress = 0xe07459496b36acd2712b6e7b36425aa4c004bdbe
    // this.account = 0xaa526b5ccad7b4c44e0f664689cda4cad501f414

    try {
      this.erc721Stub = new AlgoPainterERC721StubProxy(
        this.nftContractAddress.toLowerCase()
      );

      this.nftContractName = await this.erc721Stub.name();
      const nftContractSymbol = await this.erc721Stub.symbol();
      this.nftContractName += ` (${nftContractSymbol})`;

      const numOfNfts = await this.erc721Stub.balanceOf(
        this.account,
        // '0xaa526b5ccad7b4c44e0f664689cda4cad501f414'
      );

      if (numOfNfts > 0) {
        for (let i = 0; i < numOfNfts; i++) {
          const tokenId = await this.erc721Stub.tokenOfOwnerByIndex(
            this.account,
            // '0xaa526b5ccad7b4c44e0f664689cda4cad501f414',
            i
          );

          let tokenURI = await this.erc721Stub.tokenURI(tokenId);

          tokenURI = multihash(tokenURI)
            ? `https://ipfs.io/ipfs/${tokenURI}`
            : tokenURI;

          try {
            const result = await fetch(tokenURI);
            if (result.ok) {
              const output = await result.json();
              this.nftDescriptorList.push({
                id: tokenId,
                name: output.name ? output.name : undefined,
                description: output.description ? output.description : undefined,
                image: output.imagePreview ? output.imagePreview : output.image,
                params: output,
                descriptor: tokenURI
              });

              const label: string = `${output.name as string} (${tokenId})`;
              const active: boolean = !!(output.name && output.image);

              this.nftsOptions.push({
                label: output.name ? label : tokenId,
                value: tokenId,
                active: active,
                id: tokenId,
                name: output.name,
                description: output.description,
                image: output.image,
              });

              active ? this.nftsActiveIdsList.push(tokenId) : this.nftsInactiveIdsList.push(tokenId);
            }
          } catch (e) {
            this.nftsInactiveIdsList.push(tokenId);
          }
        }

        this.inactiveIdsMsg += this.$t(
          'dashboard.registerExternal.inactiveIds1'
        );

        this.nftsInactiveIdsList.forEach((id, i) => {
          if (i + 1 === 1) {
            this.inactiveIdsMsg += id;
          } else if (i + 1 === this.nftsInactiveIdsList.length) {
            this.inactiveIdsMsg += ` and ${id}`;
          } else {
            this.inactiveIdsMsg += `, ${id}`;
          }
        });

        this.inactiveIdsMsg += this.$t(
          'dashboard.registerExternal.inactiveIds2'
        );
      } else {
        this.warningMsg = this.$t('dashboard.registerExternal.noNFTs');
        this.isWarning = true;
      }
    } catch (e) {
      this.warningMsg = this.$t('dashboard.registerExternal.invalidAddress');
      this.isWarning = true;
    } finally {
      this.loadingOptions = false;
    }
  }

  validateFields() : boolean {
    return !!(this.nftsActiveIdsList &&
              this.nftsActiveIdsList.length > 0 &&
              this.account &&
              this.nftContractAddress &&
              this.nftDescriptorList &&
              this.nftDescriptorList.length > 0);
  }

  async registerNFTs() {
    this.loadingRegister = true;

    let res: any;

    if (this.validateFields()) {
      const data = <CreateCollectionByExternalContractRequest>{
        address: this.nftContractAddress,
        name: this.nftContractName,
        account: this.account,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        nfts: this.nftDescriptorList.map(a => a as unknown as ExternalNFTInfo)
      };

      const collectionController = new CollectionController();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      res = await collectionController.createCollectionByExternalContract(data);
    }

    if (res.status && res.status === 200) {
      this.$q.notify({
        type: 'positive',
        message: this.$t(
          'dashboard.registerExternal.registerSuccess'
        ),
      })
    } else {
      if (!res.response.data.success && res.response.data.type === 409) {
        this.$q.notify({
          type: 'negative',
          message: this.$t(
            'dashboard.registerExternal.registerDuplicate'
          ),
        })
      } else {
        this.$q.notify({
          type: 'negative',
          message: this.$t(
            'dashboard.registerExternal.registerFailure'
          ),
        })
      }
    }

    this.loadingRegister = false;
  }
}
</script>

<style scoped lang="scss">
.nft-card {
  // border: 1px $primary solid;
  border-radius: 5px;
  padding: 16px;
  margin-bottom: 16px;
}

.label {
  font-weight: 400;
  margin: 0px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
