<template>
  <div class="">
    <h5 class="text-bold">{{ $t('dashboard.createCollection.aboutTheCollection.about') }}</h5>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center items-center content-center' : ' row  justify-between items-start content-between']">
      <div class="">
        <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column reverse wrap justify-center items-center content-center' : '  row justify-between items-start content-between']">
          <div class="col-xs-6 col-sm-12 col-md-7 col-xs-12">
            <q-input
              v-model="fields.name"
              :label="$t('dashboard.createCollection.aboutTheCollection.nameArtist')"
              :rules="[ name => name.length != 0 && name.length < 30]"
              :error-message="$t('dashboard.createCollection.aboutTheCollection.nameArtistError')"
              maxlength="30"
              counter
            />
            <q-input
              v-model="fields.title"
              :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
              :rules="[ name => name.length != 0 && name.length < 30]"
              :error-message="$t('dashboard.createCollection.aboutTheCollection.nameCollectionError')"
              maxlength="30"
              counter
            />
            <q-input
              v-model="fields.webSite"
              class="input col-sm-12 col-md-6 q-pr-md"
              :label="$t('dashboard.createCollection.aboutTheCollection.website')"
            />
            <q-input
              v-model="fields.customProfile"
              class="input col-sm-12 col-md-6 q-pr-md"
              :label="$t('dashboard.createCollection.aboutTheCollection.customUrl')"
              prefix="appv2.algopainter.art/collection/"
            />
            <q-input
              v-model="fields.bio"
              :label="$t('dashboard.createCollection.aboutTheCollection.description')"
              :rules="[ val => val.length < 5001]"
              :error-message=" $t('dashboard.editProfile.erroBio')"
              outlined
              class="responsive-input q-col-gutter-x-md q-mt-md"
              type="textarea"
              maxlength="500"
              counter
              autogrow
            />
          </div>
          <div class="q-gutter-xl column wrap justify-center items-center content-center">
            <div class="column  justify-center items-center content-center">
              <div v-if="fields.avatar !=null">
                <img
                  :src="fields.avatar"
                  class="img "
                >
              </div>
              <div v-else>
                <img
                  src="../../../src/assets/placeholder-images/do-utilizador.png"
                  class="img "
                >
              </div>
              <label
                for="imagem"
                class="labelFile"
              >
                {{ $t('createCollectible.create.import') }}
              </label>
              <input
                id="imagem"
                type="file"
                name="imagem"
                @change="previewImage"
              >
            </div>
          </div>
        </div>

        <h5 class="text-bold text-center q-mb-none q-ml-md">
          {{ $t('dashboard.editProfile.sMedia') }}
        </h5>
        <div class="row q-col-gutter-x-xl" :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'q-col-gutter-x-xl' : ' row q-col-gutter-x-xl']">
          <q-input
            v-model="fields.facebook"
            class="input col-sm-12 col-md-6 col-xs-12"
          >
            <template #before>
              <q-icon
                color="primary"
                name="facebook"
              />
            </template>
          </q-input>
          <q-input
            v-model="fields.twitter"
            class="input col-sm-12 col-md-6 col-xs-12"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-twitter"
              />
            </template>
          </q-input>
          <q-input
            v-model="fields.instagram"
            class="input col-sm-12 col-md-6 col-xs-12"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-instagram"
              />
            </template>
          </q-input>
          <q-input
            v-model="fields.gmail"
            class="input col-sm-12 col-md-6 col-xs-12"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-google"
              />
            </template>
          </q-input>
          <q-input
            v-model="fields.telegram"
            class="input col-sm-12 col-md-6 col-xs-12"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-telegram"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { resizeImage } from 'src/helpers/utils';
import { Watch } from 'vue-property-decorator';

class Props {
  step = prop({
    type: Number,
    required: true,
  });
}

export default class AboutTheCollection extends Vue.with(Props) {
  fields = {
    avatar: '/images/do-utilizador (1).png',
    title: '',
    name: '',
    description: '',
    owner: '',
    creator: '',
    account: '',
    bio: '',
    webSite: '',
    customProfile: '',
    facebook: '',
    twitter: '',
    instagram: '',
    gmail: '',
    telegram: '',
  }

  async previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newLocala = newLocal!;
    const file = newLocala[0];
    const toBase64 = (file: Blob) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result || '').toString());
      reader.onerror = error => reject(error);
    });
    const base64 = await toBase64(file);
    const resized = await resizeImage(base64, 500, 500) as string;
    if (file) {
      this.fields.avatar = resized;
    } else {
      this.fields.avatar = '';
    }
  }

  @Watch('step')
  onStepChanged() {
    if (this.step === 2) {
      this.$emit('data', this.fields, this.step - 1)
    }
  }
}
</script>
<style lang="scss">
.img{
  width: 210px;
  height: 210px;
  border-radius: 50%;
}
input[type='file'] {
  display: none;
}
.labelFile {
  padding: 10px 5px;
  background: #f4538d;
  border-radius: 10px;
  align-items: center;
  text-align: center;
  font-size: 15px;
  cursor: pointer;
  color: aliceblue;
  height: 30%;
}
</style>
