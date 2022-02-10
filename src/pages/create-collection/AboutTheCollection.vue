<template>
  <div>
    <h5 class="text-bold">{{ $t('dashboard.createCollection.aboutTheCollection.about') }}</h5>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'col-sm-12' : 'col']">
      <q-form>
        <div>
          <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'col-sm-12 column reverse' : '  row justify-between items-start content-between']">
            <div class="col-xs-6 col-sm-12 col-md-7 col-xs-12">
              <q-input
                ref="artistName"
                v-model="fields.artistName"
                :label="$t('dashboard.createCollection.aboutTheCollection.nameArtist')"
                :rules="[ name => validArtistName(name) || isErrorMsg]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.nameArtistError')"
                maxlength="30"
                counter
                @input="validateForm"
              />
              <q-input
                ref="nameCollection"
                v-model="fields.nameCollection"
                :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
                :rules="[ name => validateCollectionName(name) || $t('dashboard.createCollection.aboutTheCollection.nameCollectionError'),
                          name => checkName || $t('dashboard.createCollection.aboutTheCollection.nameCollectionUse')]"
                maxlength="30"
                counter
                @keyup="getCollectionnName"
              >
                <template v-if="checkName !== null" #append>
                  <q-icon
                    v-if="checkName"
                    name="mdi-checkbox-marked-circle"
                    color="green"
                  />
                  <q-icon
                    v-else
                    name="mdi-close-circle"
                    color="red"
                  />
                </template>
              </q-input>
              <q-input
                v-model="fields.webSite"
                class="input col-sm-12 col-md-6 q-pr-md"
                :label="$t('dashboard.createCollection.aboutTheCollection.website')"
              />
              <!-- <q-input
                ref="customProfile"
                v-model="fields.customProfile"
                class="input col-sm-12 col-md-6 q-pr-md"
                :label="$t('dashboard.createCollection.aboutTheCollection.customUrl')"
                prefix="appv2.algopainter.art/collection/"
                :rules="[ name => name.length != 0]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.custonError')"
              /> -->
              <q-input
                ref="description"
                v-model="fields.description"
                :label="$t('dashboard.createCollection.aboutTheCollection.description')"
                :rules="[ val => val.length != 0 && val.length < 500]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.descriptionError')"
                outlined
                class="responsive-input q-col-gutter-x-md q-mt-md"
                type="textarea"
                maxlength="500"
                counter
                autogrow
              >
              </q-input>
            </div>
            <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'q-gutter-xl column  justify-center items-center content-center' : 'column  justify-center items-center content-center avatar']">
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

          <!-- <h5 class="text-bold text-center q-mb-none q-ml-md">
            {{ $t('dashboard.editProfile.sMedia') }}
          </h5> -->
          <!-- <div class="row q-col-gutter-x-xl" :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'q-col-gutter-x-xl' : ' row q-col-gutter-x-xl']">
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
          </div> -->
        </div>
        <div v-if="isError && isVerifyingTheForm" class="error row q-mt-lg">
          <div class="col-2 flex">
            <q-avatar
              size="60px"
              color="negative"
              class="icon self-center"
              text-color="white"
            >
              <q-icon name="mdi-alert-circle" />
            </q-avatar>
          </div>
          <div class="col-10 self-center message">
            {{ isErrorMsg }}
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import { Vue, prop } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

class Props {
  step = prop({
    type: Number,
    required: true,
  });

  checkForm = prop({
    type: String,
    required: true,
  });
}

export default class AboutTheCollection extends Vue.with(Props) {
    declare $refs: {
    artistName: QInput;
    nameCollection: QInput;
    customProfile: QInput;
    description: QInput;
  };

  static FILE_SIZE_LIMIT = 31457280;
  fields = {
    avatar: '/images/do-utilizador (1).png',
    nameCollection: '',
    artistName: '',
    description: '',
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
  isError: boolean = false;
  isErrorCN: boolean = false;
  isVerifyingTheForm: boolean = false;
  isErrorMsg: string = '';
  checkName: boolean | null = null;

  mounted() {
    void this.getCollectionnName()
  }

   @Watch('checkForm')
  onCheckFormErrorChanged() {
    if (this.checkForm) {
      this.$emit('verifyFormOne', this.validateForm());
    }
  }

   getCollectionnName() {
     if (this.fields.nameCollection !== '') {
       void this.$store.dispatch({
         type: 'mint/collectionName',
         collectionName: this.fields.nameCollection,

       }).then(() => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
         const collectionName = this.$store.getters['mint/GET_COLLECTION_NAME'];
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
         // this.userOnSale = customValeu.data;
         this.checkName = collectionName.data.length === 0
       });
     } else {
       this.checkName = null
     }
   }

   validateForm() {
     this.isVerifyingTheForm = true;
     if (this.fields.artistName === '') {
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameArtistError')
       this.isError = true;
       void this.$refs.artistName.validate()
     } else if (this.fields.nameCollection.length < 6 || this.fields.nameCollection === '') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameCollectionError')
       void this.$refs.nameCollection.validate()
     } else if (!this.checkName) {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameCollectionUse')
       void this.$refs.nameCollection.validate()
     } else if (this.fields.description === '') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.descriptionError')
       void this.$refs.description.validate()
     } else if (this.fields.avatar === '/images/do-utilizador (1).png') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.enableAvatar')
     } else {
       this.isVerifyingTheForm = false;
       console.log('true');
       return true;
     }

     return false;
   }

   validArtistName(name: string) {
     console.log(name)
     if (name === '' || this.fields.artistName === '') {
       this.isError = true;
       return false;
     } else {
       this.isError = false;
       return true;
     }
   }

   validateCollectionName(val: string) {
     if (val === '' || this.fields.nameCollection === '' || val.length < 6) {
       this.isError = true;

       return false;
     } else {
       this.isError = true;

       return true;
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
             this.validateForm()
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

.avatar{
  margin-right: 10%;
}
.error {
  padding: 10px;
  border: $primary solid 1px;
  border-radius: 5px;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .error {
    .icon {
      font-size: 45px !important;
    }
    .message {
      font-size: 12px;
    }
  }
}

@media (max-width: 360px) {
  .error {
    .icon {
      font-size: 40px !important;
    }
  }
}

@media (max-width: 280px) {
  .error {
    .icon {
      font-size: 28px !important;
    }
    .message {
      font-size: 10px;
    }
  }
}
</style>
