<template>
  <div>
    <q-btn-dropdown
      class="btn-dropdown"
      dropdown-icon="mdi-dots-horizontal"
    >
      <q-list>
        <q-item
          v-for="networkOptions in socialNetworks"
          :key="networkOptions.value"
          v-close-popup
          clickable
          @click="share(art.id, networkOptions.label)"
        >
          <q-item-section>
            <q-item-label>
              <q-icon
                color="primary"
                size="sm"
                :name="networkOptions.name"
              />
              {{ networkOptions.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { PropType } from 'vue';
import { IArt } from 'src/models/IArt';
class Props {
  art = prop({
    type: Object as PropType<IArt>,
    required: true,
  });
}
interface Ioptions {
  socialNetworks: string;
}
export default class ShareArtIcons extends Vue.with(Props) {
  share(id: string, socialMedia: string) {
    const urlsShared: {[index: string]:string} = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=https://app.algopainter.art/paintings/${id}`,
      Twitter: `https://twitter.com/intent/tweet?url=https://app.algopainter.art/paintings/${id}&amp;text=teste&amp;hashtags=algoPainter,Algo%20Painter`,
      Telegram: `https://telegram.me/share/?url=https://app.algopainter.art/paintings/${id}%3F&title=Alogo%20painter%20I%20`,
      Email: 'mailto:[]?subject=AlgoPainter',
    };
    console.log(socialMedia);
    const linkElement = document.createElement('a');
    linkElement.href = (urlsShared[socialMedia]);
    window.open(linkElement.href, '_blank', 'width=550, height=555, top=100, left=190, scrollbars=no');
  }

  options: Ioptions = {
    socialNetworks: '',
  }

  socialNetworks = [
    {
      value: 0,
      label: 'Facebook',
      name: 'facebook',
    },
    {
      value: 0,
      label: 'Twitter',
      name: 'mdi-twitter',
    },
    {
      value: 0,
      label: 'Telegram',
      name: 'mdi-telegram',
    },
    {
      value: 0,
      label: 'Email',
      name: 'mdi-email',
    },
  ]
}

</script>
<style scoped>
.btn-dropdown{
  color: #f4538d;
}
.link-sharer{
  text-decoration: none;
 color: black;
}
.btn-dropdown:before{
  box-shadow: none;
  border: none;
}
</style>
