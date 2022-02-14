<template>
  <form-generator
    v-if="params || defaultValues"
    :params="params"
    :default-values="defaultValues"
    @generate-preview="GeneratePreview"
  />
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component';
import { mapGetters } from 'vuex';
import FormGenerator from 'src/pages/create-collection/FormGenerator.vue';
import { IFormParams } from 'src/models/ICreatorCollection';
import { ICollection } from 'src/models/ICollection';

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
      collectionData: 'GET_COLLECTION_DATA',
    }),
  }
})
export default class NewPaintingLeftInfo extends Vue.with(Props) {
  collectionData!: ICollection;
  params?: IFormParams[];
  defaultValues: (number | string | boolean)[] = [];

  isErr: boolean = false;
  errMsg: string = '';
  isConfigured: boolean = false;

  created() {
    // this.getCollectionData().catch(console.error);
    this.mockedParams();
  }

  async getCollectionData() {
    await this.$store
      .dispatch({
        type: 'mint/collectionData',
        collectionCustomUrl: this.collectionCustomUrl
      })
      .then(() => {
        this.params = this.collectionData?.params;

        this.params?.forEach((param, i) => {
          this.defaultValues[i] = param.defaultValue;
        });
      })
  }

  GeneratePreview(generatedParams: (number | string | boolean)[]) {
    this.isErr = false;
    this.errMsg = '';

    this.setPreviewUrl(this.previewUrl(generatedParams)).catch(console.error);
  }

  previewUrl(generatedParams: (number | string | boolean)[]) {
    let previewUrl: string = this.collectionData.collectionInfo.api + '?';

    if (!this.collectionData.collectionInfo.isSpecialParamsChecked) {
      if (this.collectionData.collectionInfo.isSizeInUrlChecked) {
        previewUrl += `size=${this.collectionData.collectionInfo.width}x${this.collectionData.collectionInfo.height}&`;
      } else {
        previewUrl += `width=${this.collectionData.collectionInfo.width}&height=${this.collectionData.collectionInfo.height}&`;
      }
    }

    this.collectionData.fixedParams.forEach((param) => {
      previewUrl += `${param.name}=${param.value.toString()}&`
    })

    this.collectionData.params.forEach((param, i) => {
      previewUrl += `${param.name}=${generatedParams[i].toString()}`

      if ((i + 1) !== this.collectionData.params.length) {
        previewUrl += '&'
      }
    })
    const searchRegExp = /\s/g;

    return previewUrl.replace(searchRegExp, '%20');
  }

  async setPreviewUrl(previewUrl: string) {
    await this.$store
      .dispatch({
        type: 'mint/previewUrl',
        previewUrl: previewUrl
      })
  }

  mockedParams() {
    this.params = [
      {
        name: 'background',
        label: 'Background',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Bitcoin',
          },
          {
            value: '2',
            label: 'Block Saturation',
          },
          {
            value: '3',
            label: 'Inner Circuit',
          },
          {
            value: '4',
            label: 'High Voltage',
          },
          {
            value: '5',
            label: 'Mars',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Bitcoin'
      },
      {
        name: 'biological sex',
        label: 'Biological Sex',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Female',
          },
          {
            value: '1',
            label: 'Male',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Female'
      },
      {
        name: 'Expressions',
        label: 'Expressions',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Neutral',
          },
          {
            value: '1',
            label: 'Happy',
          },
          {
            value: '2',
            label: 'Angry',
          },
          {
            value: '3',
            label: 'Disgusted',
          },
          {
            value: '4',
            label: 'Impressed',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Angry'
      },
      {
        name: 'skin',
        label: 'Skin',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Space Code',
          },
          {
            value: '2',
            label: 'Deep Tracking',
          },
          {
            value: '3',
            label: 'Nebula Metrics',
          },
          {
            value: '4',
            label: 'Plasma',
          },
          {
            value: '5',
            label: 'Galaxy Node',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Space Code'
      },
      {
        name: 'use wiseframe',
        label: 'Use Wiseframe',
        dataType: 'string',
        maxLength: 64,
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
        name: 'wiseframe hue',
        label: 'Wiseframe Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'Use Wireframe Blend',
        label: 'Use Wireframe Blend',
        dataType: 'string',
        maxLength: 64,
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
        name: 'Wireframe Blend style',
        label: 'Wireframe Blend Style',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '0',
            label: 'Add',
          },
          {
            value: '1',
            label: 'Darken',
          },
          {
            value: '2',
            label: 'Difference',
          },
          {
            value: '3',
            label: 'Exclusion',
          },
          {
            value: '4',
            label: 'Hardlight',
          },
          {
            value: '5',
            label: 'Lighten',
          },
          {
            value: '7',
            label: 'Multiply',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Add'
      },
      {
        name: 'innercolor hue',
        label: 'InnerColor Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'magic',
        label: 'Magic',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Select',
        options: [
          {
            value: '1',
            label: 'Fractal Perception',
          },
          {
            value: '2',
            label: 'Soul Link',
          },
          {
            value: '3',
            label: 'Magnetic Fields',
          },
          {
            value: '4',
            label: 'Z-Mesh',
          },
        ],
        min: 0,
        max: 10,
        defaultValue: 'Fractal Perception'
      },
      {
        name: 'overlay hue',
        label: 'Overlay Hue',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Slider',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: 0
      },
      {
        name: 'use shadow',
        label: 'Use Shadow',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: false
      },
      {
        name: 'flip',
        label: 'Flip',
        dataType: 'string',
        maxLength: 64,
        fieldType: 'Checkbox',
        options: [
          {
            label: 'option label',
            value: 'option value'
          }
        ],
        min: 0,
        max: 9,
        defaultValue: false
      },
      /*{
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
      */
    ]

    this.params?.forEach((param, i) => {
      this.defaultValues[i] = param.defaultValue;
    });
  }
}

</script>