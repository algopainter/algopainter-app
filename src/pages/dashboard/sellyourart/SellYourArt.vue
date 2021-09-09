<template>
  <div
    v-if="loading"
    class="flex flex-center q-pa-xl"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div
    v-else
    class="row q-col-gutter-lg"
  >
    <div
      v-if="image"
      class="col-12 col-sm-4 image-preview"
    >
      <div>
        <q-img :src="image.nft.previewImage" />
      </div>
      <div class="title">
        {{ image.title }}
      </div>
      <div class="description">
        {{ image.description }}
      </div>
    </div>
    <div class="col-12 col-sm-8">
      <div class="row q-col-gutter-md">
        <div class="col-12 header">
          {{ $t('dashboard.sellYourArt.createAuction') }}
        </div>
        <div class="col-12">
          <q-input
            v-model="auction.minimumPrice"
            :label="$t('dashboard.sellYourArt.minimumPrice')"
            type="number"
            color="primary"
          >
            <template #append>
              <q-btn-dropdown
                color="primary"
                flat
              >
                <template #label>
                  <q-avatar
                    v-if="selectedCoin"
                    size="sm"
                    class="q-mr-md"
                  >
                    <img :src="selectedCoin.img">
                  </q-avatar>
                  <div>
                    {{ selectedCoinLabel }}
                  </div>
                </template>
                <template #default>
                  <q-list>
                    <q-item
                      v-for="coin in allowedCoins"
                      :key="coin.value"
                      v-close-popup
                      clickable
                      @click="selectCoin(coin.value)"
                    >
                      <q-item-section avatar>
                        <q-avatar size="sm">
                          <img :src="coin.img">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ coin.label }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </template>
              </q-btn-dropdown>
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <date-time-field
            v-model="auction.endDate"
            :options="endDateOptions"
            :label="$t('dashboard.sellYourArt.endDate')"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="auction.bidBackFee"
            type="number"
            :label="$t('dashboard.sellYourArt.bidBackFee')"
          />
        </div>
        <div class="col-12 flex justify-end">
          <algo-button
            color="primary"
            :label="$t('dashboard.sellYourArt.createAuction')"
            @click="createAuction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';
import moment from 'moment';

import { getImage } from 'src/api/images';
import { IImage } from 'src/models/IImage';
import AlgoPainterAuctionSystemProxy, {
  TokenType,
} from 'src/eth/AlgoPainterAuctionSystemProxy';
import AlgoPainterItemProxy from 'src/eth/AlgoPainterItemProxy';
import { getAuctionSystemContractByNetworkId } from 'src/eth/Config';
import { NetworkInfo } from 'src/store/user/types';

import AlgoButton from 'components/common/Button.vue';
import DateTimeField from 'components/fields/DateTimeField.vue';

interface INewAuction {
  minimumPrice: number;
  endDate: string;
  coin: string;
  bidBackFee: number;
}

interface IAllowedTokens {
  [key: string]: boolean;
}

@Options({
  components: {
    AlgoButton,
    DateTimeField,
  },
  computed: {
    ...mapGetters('user', {
      userAccount: 'account',
      networkInfo: 'networkInfo',
    }),
  },
})
export default class SellYourArt extends Vue {
  auctionSystem!: AlgoPainterAuctionSystemProxy;
  artTokenContract!: AlgoPainterItemProxy;
  networkInfo!: NetworkInfo;
  userAccount!: string;

  image: IImage | null = null;
  loading: boolean = false;
  loadingCoins: boolean = false;

  auction: INewAuction = {
    minimumPrice: 0,
    endDate: '',
    coin: '',
    bidBackFee: 0,
  };

  allowedTokens: IAllowedTokens = {};

  creatingAuction: boolean = false;

  rawCoinsOptions = [
    {
      value: '1',
      label: 'BTC',
      tokenAddress: '',
      img: '/images/BTC.svg',
    },
    {
      value: '2',
      label: 'BNB',
      tokenAddress: '',
      img: '/images/BNB.svg',
    },
    {
      value: '3',
      label: 'ALGOP',
      tokenAddress: '0x01A9188076f1231dF2215F67b6A63231fE5e293E',
      img: '/images/ALGOP.svg',
    },
    {
      value: '4',
      label: 'ETH',
      tokenAddress: '',
      img: '/images/ETH.svg',
    },
    {
      value: '5',
      label: 'DASH',
      tokenAddress: '',
      img: '/images/DASH.svg',
    },
  ];

  get auctionSystemContractAddress() {
    return getAuctionSystemContractByNetworkId(this.networkInfo.id);
  }

  get allowedCoins() {
    return this.rawCoinsOptions.filter((rawCoin) => {
      return this.allowedTokens[rawCoin.tokenAddress];
    });
  }

  get selectedCoin() {
    const { coin } = this.auction;

    if (!coin) {
      return null;
    }

    const selectedOption = this.allowedCoins
      .find((option) => option.value === coin);

    if (!selectedOption) {
      return null;
    }

    return selectedOption;
  }

  get selectedCoinLabel() {
    if (!this.selectedCoin) {
      return this.$t('dashboard.sellYourArt.selectCoin');
    }

    return this.selectedCoin.label;
  }

  get nowFormatted() {
    return moment().format('YYYY/MM/DD');
  }

  created() {
    if (!localStorage.isConnected) {
      return this.$router.push('/');
    }

    this.auctionSystem = new AlgoPainterAuctionSystemProxy(this.networkInfo);

    void this.loadImage();
    void this.loadAvailableTokens();
  }

  async loadImage() {
    const { id } = this.$route.params;

    this.loading = true;

    this.image = await getImage(id as string);
    this.artTokenContract = new AlgoPainterItemProxy(this.image.collectionOwner);

    const owner = await this.artTokenContract.ownerOf(this.image.nft.index);

    if (owner.toLowerCase() !== this.userAccount) {
      return this.$router.push('/');
    }

    this.loading = false;
  }

  async loadAvailableTokens() {
    try {
      this.loadingCoins = true;

      const tokens = await this.auctionSystem.getAllowedTokens();

      this.allowedTokens = tokens.reduce((curr, token) => {
        return { ...curr, [token]: true };
      }, {});

      this.loadingCoins = false;
    } catch {
      this.loadingCoins = false;
    }
  }

  selectCoin(coin: string) {
    this.auction.coin = coin;
  }

  endDateOptions(date: string) {
    return date > this.nowFormatted;
  }

  async approveContract() {
    if (!this.image) {
      return;
    }

    const contractApproved = await this.artTokenContract
      .isApprovedForAll(this.userAccount, this.auctionSystemContractAddress);

    if (contractApproved) {
      return;
    }

    return this.artTokenContract.setApprovalForAll(
      this.auctionSystemContractAddress,
      true,
      this.userAccount,
    );
  }

  async createAuction() {
    try {
      this.creatingAuction = true;

      if (!this.image || !this.selectedCoin) {
        return;
      }

      await this.approveContract();

      const { minimumPrice, endDate, bidBackFee } = this.auction;

      const response = await this.auctionSystem.createAuction(
        TokenType.ERC721,
        this.image.collectionOwner,
        this.image.nft.index,
        minimumPrice,
        moment(endDate, 'DD/MM/YYYY').endOf('day').unix(),
        this.selectedCoin.tokenAddress,
        bidBackFee,
        this.userAccount,
      );

      console.log({ response });

      this.creatingAuction = false;
    } catch {
      this.creatingAuction = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.image-preview {
  .title {
    font-weight: bold;
    font-size: 1.8rem;
  }
}
</style>
