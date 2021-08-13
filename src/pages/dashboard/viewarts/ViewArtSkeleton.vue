<template>
  <div>
    <div class="row justify-between">
      <div
        class="col-lg-6 col-md-6"
      >
        <q-skeleton
          type="text"
          width="280px"
        />
      </div>
      <div>
        <div class="right row justify-center align-center btns">
          <q-skeleton
            class="q-ma-xs"
            type="QBtn"
          />
          <q-skeleton
            class="q-ma-xs"
            type="QBtn"
          />
        </div>
      </div>
    </div>
    <div

      class="row"
    >
      <div class="col-xs-12 col-sm-6 col-md-6">
        <div class="row justify-center">
          <q-skeleton
            class="img-skeleton"
            square
          />
          <div class="col">
            <q-icon
              name="favorite_border"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
            <q-icon
              name="more_horiz"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
          </div>
        </div>
        <q-skeleton
          class="btn-new-painting"
          type="QBtn"
          width="90%"
        />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 margin">
        <div class="column items-center">
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
.img-skeleton{
    border-radius: 12px;
    height:500px;
    width: 500px;
}
.btn-size {
  width: 100px;
  height: 44px;
}

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
.img{
  width: 80%;
  border-radius:5%
}
.btn-new-painting{
  display: flex;
  margin: auto;
  margin-top: 10px
}
.margin{
    width: 200px;
    margin-left: 100px;

}
@media (max-width: 420px) {
.img{
  width: 60%;
  margin-left: 50px;
}
.img-skeleton{
    width: 200px;
    border-radius: 12px;
    height: 200px;
    margin-left: 50px;
}
.margin{
    width: 200px;
    margin-left: 0px;

}
.btns{
    margin-left: 50px;
}
}
</style>
