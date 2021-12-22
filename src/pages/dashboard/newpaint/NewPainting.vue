<template>
  <new-painting-top-info :collection="'expressions'"></new-painting-top-info>
  <div
    id="new-painting"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? '' : 'row']"
  >
    <div 
      :class="'col-7 new-painting-left-info'"
    >
      <new-painting-left-info></new-painting-left-info>
    </div>
    <div 
      :class="'col-5 new-painting-right-info'"
    >
      <new-painting-right-info></new-painting-right-info>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewPaintingTopInfo from './NewPaintingTopInfo.vue';
import NewPaintingLeftInfo from './NewPaintingLeftInfo.vue';
import NewPaintingRightInfo from './NewPaintingRightInfo.vue';

@Options({
  components: {
    NewPaintingTopInfo,
    NewPaintingLeftInfo,
    NewPaintingRightInfo,
  },
})
export default class NewPainting extends Vue {

}
</script>

<style lang="scss" scoped>
#new-painting {
  padding: 40px;
  color: $primary;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='DeepPink' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 15px;
  .new-painting-left-info {
    padding-right: 20px;
  }
  .new-painting-right-info {
    padding-left: 20px;
  }
}
@media(max-width: 768px) {
  #new-painting {
    padding: 16px;
  }
  .new-painting-left-info,
  .new-painting-right-info {
    padding: 0px !important;
  }
}
</style>