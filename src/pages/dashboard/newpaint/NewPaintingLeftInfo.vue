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