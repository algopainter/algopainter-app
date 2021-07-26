<template>
  <div
    v-for="galleryItems in gallery"
    :key="galleryItems.id"
  >
    <div class="row justify-between">
      <div
        class="col-lg-6 col-md-6"
      >
        <p class="text-bold text-h5">
          {{ galleryItems.art.name }}
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
            src="../../../assets/placeholder-images/painting.jpg"
          />
          <div class="">
            <ShareArtIcons
              :art="galleryItems.id"
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
            <p>{{ galleryItems.art.algopainter }}</p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.owner') }}
            </span>
            <p>
              {{ galleryItems.art.owner }}
            </p>
            <span class="text-bold text-primary text-h6">
              {{ $t('dashboard.viewArt.description') }}
            </span>
            <p> {{ galleryItems.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, prop } from 'vue-class-component';
import { PropType } from 'vue';
import AlgoButton from 'components/common/Button.vue';
import { IGallery } from 'src/models/IGallery';
import ShareArtIcons from 'components/common/ShareArtIcons.vue';
class Props {
   galleryItem = prop({
     type: Object as PropType<IGallery>,
     required: true,
   });
}

@Options({
  components: { AlgoButton, ShareArtIcons },
})

export default class ViewArt extends Vue.with(Props) {
  gallery: IGallery[] = [
    {
      id: '1',
      description: 'Dreaming with your eyes open',
      art: {
        id: '1',
        name: '#25 Virtual Reality',
        algopainter: 'Hashley Gwei',
        owner: '0xdE201f115f48A10878d831cC21a2EdD1aAe92121',
        source: 'placeholder',
        price: 120,
        bidBack: 0.1,
        keywords: '#art',
        pirs: {
          creators: 0.08,
          investors: 0.05,
        },
        importantPeople: [
          {
            id: '1',
            name: 'Billy Nguyen',
            picture: 'https://randomuser.me/api/portraits/men/5.jpg',
            accountable: 'Collection',
          },
          {
            id: '2',
            name: 'Beverley Weaver',
            picture: 'https://randomuser.me/api/portraits/women/31.jpg',
            accountable: 'Collection',
          },
          {
            id: '3',
            name: 'Leonard Ryan',
            picture: 'https://randomuser.me/api/portraits/men/11.jpg',
            accountable: 'Collection',
          },
        ],
      },
    },
  ]
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
