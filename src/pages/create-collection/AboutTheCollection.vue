<template>
  <div>
    <h5 class="text-bold">{{ $t('dashboard.createCollection.aboutTheCollection.about') }}</h5>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'row justify-center items-center content-center' : ' row  justify-between items-start content-between']">
      <q-form>
        <div>
          <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column reverse wrap justify-center items-center content-center' : '  row justify-between items-start content-between']">
            <div class="col-xs-6 col-sm-12 col-md-7 col-xs-12">
              <q-input
                v-model="fields.artistName"
                :label="$t('dashboard.createCollection.aboutTheCollection.nameArtist')"
                :rules="[ name => name.length != 0 && name.length < 30]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.nameArtistError')"
                maxlength="30"
                counter
                @keyup="checkForm"
              />
              <q-input
                v-model="fields.nameCollection"
                :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
                :rules="[ name => name.length != 0 && name.length < 30]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.nameCollectionError')"
                maxlength="30"
                counter
                @keyup="checkForm"
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
                @keyup="checkForm"
              />
              <q-input
                v-model="fields.description"
                :label="$t('dashboard.createCollection.aboutTheCollection.description')"
                :rules="[ val => val.length < 5001]"
                :error-message=" $t('dashboard.editProfile.erroBio')"
                outlined
                class="responsive-input q-col-gutter-x-md q-mt-md"
                type="textarea"
                maxlength="500"
                counter
                autogrow
                @keyup="checkForm"
              />
            </div>
            <div class="q-gutter-xl column wrap justify-center items-center content-center">
              <div class="column  justify-center items-center content-center">
                <div v-if="fields.avatar !=null">
                  <img
                    :src="fields.avatar"
                    class="img"
                  >
                </div>
                <div v-else>
                  <img
                    src="/images/do-utilizador (1).png"
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
                  accept=".jpg,.jpeg,.png"
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
          <div v-if="enableMessage">
            <q-icon
              color="red"
              name="mdi-close-circle"
              size="sm"
            />
            <span class="text-red">
              {{ message }}
            </span>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

class Props {
  step = prop({
    type: Number,
    required: true,
  });
}

export default class AboutTheCollection extends Vue.with(Props) {
  static FILE_SIZE_LIMIT = 31457280;
  fields = {
    avatar: '/images/do-utilizador (1).png',
    nameCollection: '',
    artistName: '',
    description: '',
    owner: '',
    creator: '',
    account: '',
    webSite: '',
    customProfile: '',
    facebook: '',
    twitter: '',
    instagram: '',
    gmail: '',
    telegram: '',
    fileName: '',
  }

  message: string = '';
  enableMessage: boolean = true;

  mounted() {
    void this.checkForm()
  }

  checkForm() {
    if (this.fields.avatar === '/images/do-utilizador (1).png') {
      this.$emit('check-form', true)
      this.message = this.$t('dashboard.createCollection.aboutTheCollection.enableAvatar')
      this.enableMessage = true;
    } else if (this.fields.artistName === '') {
      this.$emit('check-form', true)
      this.message = this.$t('dashboard.createCollection.aboutTheCollection.enableArtistName')
      this.enableMessage = true;
    } else if (this.fields.nameCollection === '') {
      this.$emit('check-form', true)
      this.message = this.$t('dashboard.createCollection.aboutTheCollection.enableNameCollection')
      this.enableMessage = true;
    } else if (this.fields.customProfile === '') {
      this.$emit('check-form', true)
      this.message = this.$t('dashboard.createCollection.aboutTheCollection.enableCuston')
      this.enableMessage = true;
    } else if (this.fields.description === '') {
      this.$emit('check-form', true)
      this.message = this.$t('dashboard.createCollection.aboutTheCollection.enableDescription')
      this.enableMessage = true;
    } else {
      this.$emit('check-form', false)
      this.enableMessage = false;
    }
  }

  async previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;

    if (newLocal) {
      const file = newLocal[0];
      this.fields.fileName = file.name;

      if (file) {
        if (file.size < AboutTheCollection.FILE_SIZE_LIMIT) {
          if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
            const toBase64 = (file: Blob) => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve((reader.result || '').toString());
              reader.onerror = error => reject(error);
            });
            const base64 = await toBase64(file);
            this.fields.avatar = base64;
            this.checkForm()
          } else {
            this.$q.notify({
              type: 'negative',
              message: this.$t('createCollectible.create.errorTypeImage')
            })
          }
        } else {
          this.$q.notify({
            type: 'negative',
            message: this.$t('createCollectible.create.errorFile'),
          });
          this.fields.avatar = '';
        }
      } else {
        this.fields.avatar = '';
      }
    }
  }

  @Watch('step')
  onStepChanged() {
<<<<<<< HEAD
    if (this.step === 2) {
      this.$emit('data', this.fields, this.step - 1)
=======
    if (this.step > 1) {
      this.$emit('form', this.fields, this.step)
>>>>>>> 921818ea44780ba550ce90e2cb8a5d79f38bc79f
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
