<template>
  <form-generator
    v-if="params || defaultValues"
    :params="params"
    :default-values="defaultValues"
  />
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import FormGenerator from 'src/pages/create-collection/FormGenerator.vue'
import { IFormParams } from 'src/models/ICreatorCollection'

class Props {
  collectionCustomUrl = prop({
    type: String,
    required: true,
  });
}

@Options({
  components: {
    FormGenerator
  },
  computed: {
    ...mapGetters('mint', {
      collectionParams: 'GET_COLLECTION_PARAMS',
    }),
  }
})
export default class NewPaintingLeftInfo extends Vue.with(Props) {
  collectionParams?: IFormParams[];
  params?: IFormParams[];
  defaultValues: (number | string | boolean)[] = [];

  created() {
    // this.getCollectionParams().catch(console.error);
    this.mockedParams();
  }

  mockedParams() {
    this.params = [
      {
        name: 'Chemist',
        label: 'Chemist name',
        dataType: 'string',
        fieldType: 'Input Textfield',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: 'Lavoisier'
      },
      {
        name: 'Compound',
        label: 'Chemist name',
        dataType: 'string',
        fieldType: 'Select',
        options: [
          {
            label: 'Acid',
            value: '0'
          },
          {
            label: 'Ionic',
            value: '1'
          },
          {
            label: 'Sodium Chloride',
            value: '2'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: 'Sodium Chloride'
      },
      {
        name: 'Pure',
        label: 'Is the compound pure?',
        dataType: 'string',
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 10,
        defaultValue: true
      },
      {
        name: 'Amount',
        label: 'Amount of compound',
        dataType: 'string',
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 1,
        max: 10,
        defaultValue: 5
      },
    ]

    this.params?.forEach((param, i) => {
      this.defaultValues[i] = param.defaultValue;
    });
  }

  async getCollectionParams() {
    await this.$store
      .dispatch({
        type: 'mint/collectionParams',
        collectionCustomUrl: this.collectionCustomUrl
      })
      .then(() => {
        this.params = this.collectionParams;

        this.params?.forEach((param, i) => {
          this.defaultValues[i] = param.defaultValue;
        });
      })
  }
}

</script>