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
import { PropType } from 'vue';
import { IAuctionItem2 } from 'src/models/IAuctionItem2';
class Props {
  isHot = prop({
    type: Object as PropType<IAuctionItem2>,
    required: true,
  })

  sharer = prop({
    required: true,
    type: String,
  })
}
interface Ioptions {
  socialNetworks: string;
}
export default class ShareArtIcons extends Vue.with(Props) {
  share(id: string, socialMedia: string) {
    const urlsShared: {[index: string]:string} = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fstackoverflow.com%2Fq%2F20956229%2F1101509&picture=http%3A%2F%2Fwww.applezein.net%2Fwordpress%2Fwp-content%2Fuploads%2F2015%2F03%2Ffacebook-logo.jpg&title=A+nice+question+about+Facebook&quote=Does+anyone+know+if+there+have+been+recent+changes+which+could+have+suddenly+stopped+this+from+working%3F&description=Apparently%2C+the+accepted+answer+is+not+correct.`,
      Twitter: `http://twitter.com/share?text=Im Sharing on Twitter&url=https://stackoverflow.com/users/2943186/youssef-subehi&hashtags=stackoverflow,example,youssefusf`,
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
