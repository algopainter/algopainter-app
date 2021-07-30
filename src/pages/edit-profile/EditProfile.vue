<template>
  <q-form
    @submit="onSubmit"
  >
    <div class="form row">
      <div class="col-xs-12 col-sm-12 col-md-3">
        <div class="column items-center q-gutter-md">
          <div class="col q-mt-xl">
            <img
              :src="formFields.img"
              class="img "
            >
          </div>
          <div class="col">
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
      <div class="col-xs-12 col-sm-12 col-md-9 column items-evenly ">
        <div class="responsive-input q-col-gutter-x-md">
          <q-input
            v-model="formFields.name"
            :label="$t('dashboard.editProfile.name')"
          />
          <q-input
            v-model="formFields.email"
            type="email"
            :label="$t('dashboard.editProfile.email')"
          />
        </div>
        <div class="responsive-input row ">
          <q-input
            v-model="formFields.customProfile"
            class="input col-sm-12 col-md-6 q-pr-md"
            :label="$t('dashboard.editProfile.custom')"
            prefix="algopainter.art/"
          />
          <q-input
            v-model="formFields.webSite"
            class="input col-sm-12 col-md-6 q-pr-md"
            :label="$t('dashboard.editProfile.webSite')"
          />
        </div>
        <q-input
          v-model="formFields.bio"
          outlined
          class="responsive-input q-col-gutter-x-md q-mt-md"
          type="textarea"
          :label="$t('dashboard.editProfile.bio')"
        />
        <h5 class="text-bold q-mb-none q-ml-md">
          {{ $t('dashboard.editProfile.sMedia') }}
        </h5>
        <div class="responsive-input row q-col-gutter-x-md">
          <q-input
            v-model="formFields.facebook"
            class="input col-sm-12 col-md-6"
          >
            <template #before>
              <q-icon
                color="primary"
                name="facebook"
              />
            </template>
          </q-input>
          <q-input
            v-model="formFields.twitter"
            class="input col-sm-12 col-md-6"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-twitter"
              />
            </template>
          </q-input>
          <q-input
            v-model="formFields.instagram"
            class="input col-sm-12 col-md-6"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-instagram"
              />
            </template>
          </q-input>
          <q-input
            v-model="formFields.gmail"
            class="input col-sm-12 col-md-6"
          >
            <template #before>
              <q-icon
                color="primary"
                name="mdi-google"
              />
            </template>
          </q-input>
          <q-input
            v-model="formFields.telegram"
            class="input col-sm-12 col-md-6"
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
      <div
        class="row justify-center btnSave"
      >
        <algo-button
          class="q-py-md q-my-md btnsize"
          type="submit"
          color="primary"
          :label="$t('dashboard.editProfile.sChanges')"
          @click="saveChanges"
          :disable="!isConnected"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import { Screen } from 'quasar';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { api } from 'src/boot/axios';
import { isError } from 'src/helpers/utils';

interface IProfile {
  name?: string;
  email?: string;
  customProfile?: string;
  img?: string| null;
  webSite? : string;
  bio?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  telegram?: string;
  gmail?: string;
}
@Options({
  components: {
    AlgoButton,
    Screen,
  },
})
export default class EditProfile extends Vue {
  formFields: IProfile = {
    customProfile: ' ',
    img: '/images/do-utilizador (1).png',
  };

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  previewImage(e: Event) {
    const newLocal = (<HTMLInputElement>e.target).files;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newLocala = newLocal!;
    const file = newLocala[0];
    if (file) {
      this.formFields.img = URL.createObjectURL(file);
    } else {
      this.formFields.img = null;
    }
  }

  async saveChanges() {
    const data = {
      ...this.formFields,
      salt: nanoid(),
    };
    const web3helper = new Web3Helper();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userAccount = this.$store.getters['user/account'] as string;
    const signatureOrError = await web3helper.hashMessageAndAskForSignature(data, userAccount);

    if (isError(signatureOrError as Error)) {
      console.log('assinatura negada ou api com falha, tratar cada erro aqui');
      return;
    }

    const request = {
      data,
      signature: signatureOrError,
      account: userAccount,
      salt: data.salt,
    };

    console.log(request);

    await api.put(`users/${userAccount}`, request);
  }

  onSubmit() {
    this.$q.notify({
      group: true,
      icon: 'mdi-check',
      message: 'Salve Profile',
      textColor: 'primary',
      position: 'center',
      timeout: 2500,
    });
  }
}
</script>
<style lang="scss" scoped>
.form{
    border: dashed 2px #f4538d;
    border-radius: 20px;
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

.img{
  width: 210px;
  height: 210px;
  border-radius: 50%;
}
body.screen--xs, body.screen--sm{
  .responsive-input{
   width: 100%;
   padding: 0 0 0 15px;
  }
  .input{
      width: 100%;
  }
}

body.screen--lg, body.screen--xl, body.screen--md{
  .responsive-input{
   width: 85%;
  }

}

.btnSave{
  width: 100%;
}

.btnsize{
  width: 300px;
}

</style>
