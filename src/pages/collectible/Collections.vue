<template>
  <div class="row justify-center q-gutter-xl">
    <div class="container-avatar">
      <q-img class="img" :src="form.avatar">
      </q-img>
      <p class="text-bold text-center"> {{ form.title }}</p>
    </div>
    <div class="description">
      <p class="text-center">
        {{ form.description }}
      </p>

      <div>
      </div>
    </div>
    <div class="btn">
      <algo-button
        type="submit"
        color="primary"
        label="Go to App"
        @click="goApp(form.namelc)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, prop, Options } from 'vue-class-component';
import { PropType } from 'vue';
import { ICreatorCollection } from 'src/models/ICreatorCollection';
import AlgoButton from 'components/common/Button.vue';

class Props {
  form = prop({
    type: Object as PropType<ICreatorCollection>,
    required: true,
  });
}
@Options({
  components: {
    AlgoButton,

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

}
.btn{
    margin-top: 130px;
}
</style>