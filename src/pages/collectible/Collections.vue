<template>
  <div class="row justify-center q-gutter-xl">
    <div class="container-avatar">
      <q-img class="img" :src="collection.avatar">
      </q-img>
      <p class="text-bold text-center"> {{ collection.title }}</p>
    </div>
    <div class="description">
      <p class="text-center">
        {{ collection.description }}
      </p>
      <div>
        <collections-description :collection="collection.namelc" />
      </div>
      <div>
      </div>
    </div>
    <div class="btn">
      <algo-button
        type="submit"
        color="primary"
        label="Go to App"
        @click="goApp(collection.namelc)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { PropType } from 'vue';
import { ICreatorCollection } from 'src/models/ICreatorCollection';
import AlgoButton from 'components/common/Button.vue';
import CollectionsDescription from './CollectionsDescription.vue'

class Props {
  collection = prop({
    type: Object as PropType<ICreatorCollection>,
    required: true,
  });
}
@Options({
  components: {
    AlgoButton,
    CollectionsDescription,

  },
})
export default class Collections extends Vue.with(Props) {
  img: string= '/images/gwei.png'

  goApp(name: string) {
    this.$router.push(`/create-collectible/new-painting/${name}`).catch(console.error);
  }
}
</script>

<style scoped>
.container-avatar{
    width: 200px;
     display: block;
    justify-content: center;
}
.img{
    display: flex;
    justify-content: center;
}
.description{
    width: 500px;
    margin-top: 88px;

}
.btn{
    margin-top: 150px;
}

  @media(max-width: 889px) {
    .description{
      margin-top: 0
    }
    .btn{
      margin-top: 0;
      margin-bottom: 15px;
    }
  }

    @media(max-width: 500px) {
    .description{
      margin-top: 0
    }
    .btn{
      margin-top: 0;
      margin-bottom: 15px;
    }
  }
</style>