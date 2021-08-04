<template>
  <div v-if="loadingDetailsData === false">
    <div class="row justify-between">
      <div
        class="col-lg-6 col-md-6"
      >
        <p class="text-bold text-h5">
          {{ detailsData.title }}
        </p>
      </div>
      <div>
        <div class="right row justify-center align-center">
          <algo-button
            :label="$t('dashboard.viewArt.goGallery')"
            class="q-ma-xs btn-size btn-grey"
            to="/gallery"
            outline
          />
          <algo-button
            :label="$t('dashboard.gallery.newPainting')"
            class="q-ma-xs btn-size"
            color="primary"
            to="/new-painting"
          />
        </div>
      </div>
    </div>
    <div

      class="row"
    >
      <div class="col-xs-12 col-sm-6 col-md-6">
        <div class="row justify-center">
          <q-img
            class="img"
            :src="detailsData.nft.previewImage"
          />
          <div class="">
            <ShareArtIcons
              :art="detailsData._id"
            />
          </div>
        </div>

        <algo-button
          color="primary"
          class="btn-new-painting"
          :label="$t('dashboard.viewArt.btnCreatepainter')"
          to="/new-painting"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="column items-center">
          <div class="col">
            <p class="text-bold text-h5">
              {{ $t('dashboard.viewArt.details') }}
            </p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.algoPainter') }}
            </span>
            <p>{{ detailsData.collectionName }} </p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.owner') }}
            </span>
            <div
              v-for="(user , index) in detailsData.users"
              :key="index"
            >
              <div v-if="user.role === 'owner'">
                <p>
                  {{ user.name }}
                </p>
              </div>
            </div>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.description') }}
            </span>
            <p> {{ detailsData.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import ShareArtIcons from 'components/common/ShareArtIcons.vue';
import { IImage } from 'src/models/IImage';
import { api } from 'src/boot/axios';

@Options({
  components: { AlgoButton, ShareArtIcons },
})

export default class ViewArt extends Vue {
  loadingDetailsData: boolean = true;
  detailsData: IImage[] = [];

  mounted() {
    const route = this.$route.params.id;
    void this.getDetailsData(route);
  }

  async getDetailsData(route: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const data = await api.get(`images/${route}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.detailsData = data.data as [];
      this.loadingDetailsData = false;
    } catch (e) {
      console.log('e', e);
    }
  }
}
</script>
<style scoped>
.btn-size {
  width: 100px;
  height: 44px;
}

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
.img{
  width: 80%;
  border-radius:5%
}
.btn-new-painting{
  display: flex;
  margin: auto;
  margin-top: 10px
}
@media (max-width: 420px) {
.img{
  width: 60%;
  margin-left: 50px;
}
}
</style>
