
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
          @click="share(sharer, networkOptions.label)"
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
class Props {
  _id = prop({
    type: String,
    required: true,
  })

  art = prop({
    required: true,
    type: String,
  })
}
interface Ioptions {
  socialNetworks: string;
}
export default class ShareArtIcons extends Vue.with(Props) {
  messageTwitter: string = "🔥Hey, look at this artwork on the AlgoPainter platform! Amazing, isn't it?"
  message: string = "Hey,  look at this artwork on the AlgoPainter platform! Amazing, isn't it?"
  share(id: string, socialMedia: string) {
    const urlsShared: {[index: string]:string} = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=https://appv2.algopainter.art/collections/${this._id}&quote=${this.message}`,
      Twitter: `http://twitter.com/share?text=${this.messageTwitter}&url=https://appv2.algopainter.art/collections/${this._id}&hashtags=AlgoPainter,ALGOP,NFTS`,
      Telegram: `https://telegram.me/share/?url=https://appv2.algopainter.art/collections/${this._id}%3F&text=${this.message}`,
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
