<template>
  <q-form
    @submit="onSubmit"
  >
    <q-card class="form row">
      <div class="col-xs-12 col-sm-12 col-md-3">
        <div class="column items-center q-gutter-md">
          <div class="col q-mt-xl">
            <div v-if="isConnected === true && formFields.avatar !=null">
              <img
                :src="formFields.avatar"
                class="img "
              >
            </div>
            <div v-else>
              <img
                src="../../../src/assets/placeholder-images/do-utilizador.png"
                class="img "
              >
            </div>
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
            :rules="[ name => name.length != 0 && name.length < 33]"
            :error-message="$t('dashboard.editProfile.erroName')"
            maxlength="32"
            counter
          />
          <q-input
            v-model="formFields.email"
            :rules="[ email => email ? email.indexOf('@') !== -1 && email.indexOf('.') !== -1 : true] "
            :error-message="$t('dashboard.editProfile.erroEmail')"
            :label="$t('dashboard.editProfile.email')"
          />
        </div>
        <div class="responsive-input row ">
          <q-input
            v-model="formFields.customProfile"
            class="input col-sm-12 col-md-6 q-pr-md"
            :label="$t('dashboard.editProfile.custom')"
            :prefix="returnPrefixUrl()"
          />
          <q-input
            v-model="formFields.webSite"
            class="input col-sm-12 col-md-6 q-pr-md"
            :label="$t('dashboard.editProfile.webSite')"
          />
        </div>
        <q-input
          v-model="formFields.bio"
          :label="$t('dashboard.editProfile.bio')"
          :rules="[ val => val ? val.length < 1001 : true]"
          :error-message=" $t('dashboard.editProfile.erroBio')"
          outlined
          class="responsive-input q-col-gutter-x-md q-mt-md"
          type="textarea"
          maxlength="1000"
          counter
          autogrow
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
          v-if="routeName === 'registerCollection'"
          class="q-py-md q-my-md btnsize"
          type="submit"
          color="primary"
          :label="$t('dashboard.editProfile.changesRegistro')"
          :disable="!isConnected"
          @click="saveChanges"
        />
        <algo-button
          v-else
          class="q-py-md q-my-md btnsize"
          type="submit"
          color="primary"
          :label="$t('dashboard.editProfile.sChanges')"
          :disable="!isConnected"
          @click="saveChanges"
        />
      </div>
    </q-card>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears
        size="50px"
        color="primary"
      />
    </q-inner-loading>
  </q-form>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import AlgoButton from 'components/common/Button.vue';
import { Watch } from 'vue-property-decorator';
import { Screen, Notify } from 'quasar';
import { nanoid } from 'nanoid';
import Web3Helper from 'src/helpers/web3Helper';
import { api } from 'src/boot/axios';
import { isError, resizeImage } from 'src/helpers/utils';
import { IProfile } from 'src/models/IProfile';

@Options({
  components: {
    AlgoButton,
    Screen,
  },
})
export default class EditProfile extends Vue {
  formFields: IProfile = {
    avatar: '/images/do-utilizador (1).png',
  };

  isLoading: boolean = false;
  isValid: boolean = false;
  paramsRouterName!: unknown;

  get isConnected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/isConnected'] as boolean;
  }

  get account() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.$store.getters['user/account'] as string;
  }

  @Watch('account')
  onPropertyChanged() {
    void this.loadData();
  }

  returnPrefixUrl() {
    return `${location.host}/user/`;
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
      this.formFields.avatar = resized;
    } else {
      this.formFields.avatar = '';
    }
  }

  mounted() {
    void this.emailValid();
    if (this.isConnected) {
      void this.loadData();
    }
  }

  validateEmail(email: string | undefined | null) {
    const response = /\S+@\S+\.\S+/;
    return response.test(email as string);
  }

  emailValid() {
    this.isValid = this.validateEmail(this.formFields.email);
  }

  get routeName() {
    return this.paramsRouterName = this.$route.params.name;
  }

  async loadData() {
    this.isLoading = true;
    try {
      const result = await api.get(`users/${this.account}`);
      this.formFields = result.data as IProfile;
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.response.data.type === 404) {
        Notify.create({
          message: "You don't have a profile recorded",
          color: 'orange',
          icon: 'mdi-alert',
        });
      } else {
        Notify.create({
          message: 'An error has occurred while getting user information',
          color: 'red',
          icon: 'mdi-alert',
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  async saveChanges() {
    this.isValid = this.validateEmail(this.formFields.email);
    const allowed: RegExp = /[^a-zA-Z0-9-]/g;
    const customProfile: string | undefined = this.formFields.customProfile;
    const notAllowed = allowed.test(customProfile as string);
    if (notAllowed) {
      Notify.create({
        message: 'Custom URLs may only contain "A-Z", "0-9" and "-"',
        color: 'red',
        icon: 'mdi-alert',
      });
      return;
    } else if (customProfile) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (customProfile[0] === '0' && customProfile[1] === 'x') {
        Notify.create({
          message: "Custom URLs may not start with '0x'",
          color: 'red',
          icon: 'mdi-alert',
        });
        return;
      }
    }
    try {
      this.isLoading = true;
      this.formFields.name = this.formFields.name?.trim();
      this.formFields.bio = this.formFields.bio?.trim();
      if (!this.formFields.email) {
        this.formFields.email = undefined;
      }

      if (!this.formFields.customProfile) {
        this.formFields.customProfile = undefined;
      }

      if (this.formFields.name === '' || this.formFields.name === undefined) {
        Notify.create({
          message: 'Field name required!',
          color: 'red',
          icon: 'mdi-alert',
        });
        return;
      }
      if (this.formFields.email === '' || this.formFields.email === undefined) {
        this.isValid = true;
      }
      if (this.isValid === false) {
        Notify.create({
          message: 'Invalid email. Enter your email correctly',
          color: 'red',
          icon: 'mdi-alert',
        });
        return;
      }

      const data = {
        ...this.formFields,
        salt: nanoid(),
      };
      const web3helper = new Web3Helper();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userAccount = this.$store.getters['user/account'] as string;
      const signatureOrError = await web3helper.hashMessageAndAskForSignature(data, userAccount);

      if (isError(signatureOrError as Error)) {
        return;
      }

      const request = {
        data,
        signature: signatureOrError,
        account: userAccount,
        salt: data.salt,
      };

      await api.put(`users/${userAccount}`, request);
      Notify.create({
        message: 'Profile updated sucessfully!',
        color: 'green',
        icon: 'mdi-check',
      });
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.response.data.type === 409) {
        Notify.create({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          message: e.response.data.message as string,
          color: 'red',
          icon: 'mdi-alert',
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (e.response.data.code === 392) {
        Notify.create({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          message: e.response.data.message as string,
          color: 'red',
          icon: 'mdi-alert',
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else {
        Notify.create({
          message: 'An error has occurred while updating profile',
          color: 'red',
          icon: 'mdi-alert',
        });
      }
    } finally {
      this.isLoading = false;
      if (this.routeName === 'registerCollection') {
        await this.$router.push('/create-collection');
      }
    }
  }

  onSubmit() {
    this.$q.notify({
      group: true,
      icon: 'mdi-check',
      message: 'Please confirm your changes...',
      textColor: 'primary',
      timeout: 2500,
    });
  }
}
</script>
<style lang="scss" scoped>
.form{
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
