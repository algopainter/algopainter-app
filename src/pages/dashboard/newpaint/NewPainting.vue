<template>
  <new-painting-top-info :collection-name="collectionName" :collection-token="collectionToken"></new-painting-top-info>
  <div
    id="new-painting"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? '' : 'row']"
  >
    <div
      :class="'col-7 new-painting-left-info'"
    >
      <component :is="collectionComponent" :collection-name="collectionName" />
    </div>
    <div
      :class="'col-5 new-painting-right-info'"
    >
      <new-painting-right-info :collection-name="collectionName" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewPaintingTopInfo from './NewPaintingTopInfo.vue';
import NewPaintingLeftInfoExpressions from './NewPaintingLeftInfoExpressions.vue';
import NewPaintingLeftInfoGwei from './NewPaintingLeftInfoGwei.vue';
import NewPaintingRightInfo from './NewPaintingRightInfo.vue';

@Options({
  components: {
    NewPaintingTopInfo,
    NewPaintingLeftInfoExpressions,
    NewPaintingRightInfo,
    NewPaintingLeftInfoGwei,
  },
})
export default class NewPainting extends Vue {
  collectionName !: string | string[];
  collectionToken?: string;
  collectionComponent!: string;

  created() {
    this.getCollectionName();
  }

  getCollectionName() {
    const { collection } = this.$route.params;
    this.collectionName = collection;

    this.collectionToken = (this.collectionName === 'gwei') ? 'ALGOP' : 'BNB';

    this.collectionComponent = (collection === 'gwei') ? 'new-painting-left-info-gwei' : 'new-painting-left-info-expressions';
  }
}
</script>

<style lang="scss" scoped>
#new-painting {
  padding: 40px;
  color: $primary;
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