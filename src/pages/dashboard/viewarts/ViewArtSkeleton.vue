<template>
  <div>
    <div class="row justify-between">
      <div class="row justify-between conteiner-text-share-shele">
        <div class="row justify-between">
          <q-skeleton
            type="text"
            width="280px"
          />
        </div>
        <div>
          <!--
            <q-icon
              name="favorite_border"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
            -->
          <q-icon
            name="more_horiz"
            color="grey-4"
            class=""
            size="30px"
          />
        </div>
      </div>
      <div>
        <div class="row">
          <q-skeleton
            class="q-ma-xs btn-newPainting"
            type="QBtn"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-6">
        <div class="row justify-center">
          <q-skeleton
            class="img"
            square
          />
        </div>
        <div class="text-download column items-center">
          <q-skeleton
            width="60px"
            type="text"
            class="text-download"
          />
          <q-skeleton
            type="QSelect"
            width="100%"
          />
          <q-skeleton
            class="btn-btnCreatepainter"
            type="QBtn"
            width="50%"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-5 col-md-5 details">
        <div class="column items-left">
          <div class="col">
            <q-skeleton
              type="text"
              width="60px"
              class="q-mb-sm"
            />
            <q-skeleton
              type="text"
              width="80px"
            />
            <q-skeleton
              type="text"
              width="180px"
              class="q-mb-sm"
            />
            <q-skeleton
              type="text"
              width="80px"
            />
            <q-skeleton
              type="text"
              width="180px"
              class="q-mb-sm"
            />
            <q-skeleton
              type="text"
              width="80px"
            />
            <q-skeleton
              type="text"
              width="80px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class ViewArtSkeleton extends Vue {
}
</script>

<style scoped>
.q-page-container{
  padding: 10px;
}
.text-download {
  color:#F4538D;
  text-align:center;
  margin-top: 7px;
}

.btn-newPainting {
  width: 180px;
  height: 44px;
}

.img{
  width: 100vw;
  height: 70vh;
}
.btn-btnCreatepainter{
  display: flex;
  margin: auto;
  margin-top: 10px
}
.conteiner-text-share-shele{
  width: 50%;
}

.details{
  margin-left: 30px;
}

@media (max-width: 450px) {
.img{
  width: 80vw;
}

.btn-newPainting {
  width: 80vw;
  height: 39px;
}
.btn-btnCreatepainter {
  width: 80vw;
  height: 39px;
}
.conteiner-text-share-shele{
  width: 100%;
}
}
</style>
