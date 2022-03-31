<template>
  <div>
    <h5 class="text-bold">{{ $t('dashboard.createCollection.aboutTheCollection.about') }}</h5>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'col-sm-12' : 'col']">
      <q-form>
        <div>
          <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'col-sm-12 column reverse' : '  row justify-between items-start content-between']">
            <div class="col-xs-6 col-sm-12 col-md-7 col-xs-12">
              <q-input
                ref="nameCollection"
                v-model="fields.nameCollection"
                :label="$t('dashboard.createCollection.aboutTheCollection.nameCollection')"
                :rules="[ name => validateCollectionName(name) || $t('dashboard.createCollection.aboutTheCollection.nameCollectionError'),
                          name => checkName || $t('dashboard.createCollection.aboutTheCollection.nameCollectionUse')]"
                maxlength="30"
                counter
                @keyup="getCollectionName"
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
                ref="webSite"
                v-model="fields.webSite"
                class="input col-sm-12 col-md-6 q-pr-md"
                :rules="[ val => val.length != 0]"
                :error-message="$t('dashboard.createCollection.aboutTheCollection.nameWebSite')"
                :label="$t('dashboard.createCollection.aboutTheCollection.website')"
              />
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
              <a
                style="color:#F4538D; cursor:pointer"
                @click="downloadPdf"
              >
                {{ $t('dashboard.createCollection.aboutTheCollection.pdf') }}
              </a>
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
        </div>
        <error v-if="isError && isVerifyingTheForm" :error-msg="isErrorMsg" />
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { QInput } from 'quasar';
import { Vue, prop, Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import Error from './Error.vue';
import { saveAs } from 'file-saver';

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

@Options({
  components: {
    Error
  }
})
export default class AboutTheCollection extends Vue.with(Props) {
  declare $refs: {
    nameCollection: QInput;
    webSite: QInput;
    customProfile: QInput;
    description: QInput;
  };

  static FILE_SIZE_LIMIT = 31457280;
  fields = {
    avatar: '/images/do-utilizador (1).png',
    nameCollection: '',
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
    void this.getCollectionName()
  }

  downloadPdf() {
    const oReq = new XMLHttpRequest();
    const URLToPDF = 'https://ipfs.io/ipfs/QmPLpvRBmUQoTVm6vhzNzAAezAtZXwqGkNhZiFwP7oLMZ6';

    oReq.open('GET', URLToPDF, true);

    oReq.responseType = 'blob';

    oReq.onload = function() {
      const file = new Blob([oReq.response], {
        type: 'application/pdf'
      });

      saveAs(file, 'Algorithmic_Artists.pdf');
    };

    oReq.send();
  }

   @Watch('checkForm')
  onCheckFormErrorChanged() {
    if (this.checkForm) {
      this.$emit('verifyFormOne', this.validateForm());
    }
  }

   getCollectionName() {
     if (this.fields.nameCollection !== '') {
       void this.$store.dispatch({
         type: 'mint/isCollectionExistent',
         collection: this.fields.nameCollection,
       }).then(() => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
         this.checkName = !this.$store.getters['mint/GET_IS_COLLECTION_EXISTENT'];
       });
     } else {
       this.checkName = null
     }
   }

   validateForm() {
     this.isVerifyingTheForm = true;
     if (this.fields.avatar === '/images/do-utilizador (1).png') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.enableAvatar')
     } else if (this.fields.nameCollection.length < 6 || this.fields.nameCollection === '') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameCollectionError')
       void this.$refs.nameCollection.validate()
     } else if (!this.checkName) {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameCollectionUse')
       void this.$refs.nameCollection.validate()
     } else if (this.fields.webSite === '') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.nameWebSite')
       void this.$refs.webSite.validate()
     } else if (this.fields.description === '') {
       this.isError = true;
       this.isErrorMsg = this.$t('dashboard.createCollection.aboutTheCollection.descriptionError')
       void this.$refs.description.validate()
     } else {
       this.isVerifyingTheForm = false;
       return true;
     }

     return false;
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
<style lang="scss" scoped>
.img{
  width: 210px;
  height: 210px;
  border-radius: 50%;
  // background-position: center
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

a {
  text-decoration: none;
}
</style>
