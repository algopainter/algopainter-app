<template>
  <new-painting-top-info
    :collection-name="collectionCustomUrl"
    :collection-token="collectionToken"
  />
  <div
    id="new-painting"
    :class="[$q.screen.lt.sm || $q.screen.lt.md ? '' : 'row']"
  >
    <div
      :class="'col-7 new-painting-left-info'"
    >
      <new-painting-left-info-gwei
        v-if="collectionCustomUrl === 'gwei'"
        :collection-name="collectionCustomUrl"
      />
      <new-painting-left-info-expressions
        v-else-if="collectionCustomUrl === 'expressions'"
        :collection-name="collectionCustomUrl"
      />
      <new-painting-left-info
        v-else
        :collection-custom-url="collectionCustomUrl"
      />
    </div>
    <div
      :class="'col-5 new-painting-right-info'"
    >
      <new-painting-right-info
        :collection-name="collectionCustomUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NewPaintingTopInfo from './NewPaintingTopInfo.vue';
import NewPaintingLeftInfoExpressions from './NewPaintingLeftInfoExpressions.vue';
import NewPaintingLeftInfoGwei from './NewPaintingLeftInfoGwei.vue';
import NewPaintingRightInfo from './NewPaintingRightInfo.vue';
import NewPaintingLeftInfo from './NewPaintingLeftInfo.vue';

@Options({
  components: {
    NewPaintingTopInfo,
    NewPaintingLeftInfoExpressions,
    NewPaintingRightInfo,
    NewPaintingLeftInfoGwei,
    NewPaintingLeftInfo
  },
})
export default class NewPainting extends Vue {
  collectionCustomUrl !: string | string[];
  collectionToken?: string;

  created() {
    this.getCollectionCustomUrl();
  }

  getCollectionCustomUrl() {
    const { collection } = this.$route.params;
    this.collectionCustomUrl = collection;
    this.collectionToken = (this.collectionCustomUrl === 'gwei') ? 'ALGOP' : 'BNB';
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