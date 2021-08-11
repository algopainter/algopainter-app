<template>
  <q-page class="q-gutter-lg q-pb-lg">
    <div class="header row">
      <div class="left col-xs-12 col-sm-12 col-md-6 col-lg-8 col-xl-7">
        <div class="btn-collection">
          <q-skeleton
            type="QBtn"
            class="btn-gwei"
          />
        </div>
      </div>
      <div class="right row q-mr-lg">
        <q-skeleton
          type="QBtn"
          class="btn btn-size q-mr-lg"
        />
        <q-skeleton
          type="QBtn"
          class="btn btn-size q-mr-lg"
        />
      </div>
    </div>
    <div
      v-for="(item, i) in 13"
      :key="i"
      class="row"
    >
      <div>
        <!--aqui -->
        <div
          class="flex q-col-gutter-md"
        >
          <div class="flex">
            <q-skeleton
              type="QAvatar"
              class="q-mr-sm"
            />
            <q-skeleton type="QAvatar" />
          </div>

          <div class=" flex justify-end items-end margin q-gutter-md">
            <q-icon
              name="more_horiz"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
            <q-icon
              name="favorite_border"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
          </div>
        </div>
        <div class="q-ml-md q-mt-sm">
          <q-skeleton
            height="250px"
            width="280px"
            square
          />
        </div>
        <div class="q-ml-md">
          <q-skeleton
            type="text"
            width="200px"
          />
          <q-skeleton
            type="text"
            width="230px"
          />
          <q-skeleton
            type="QBtn"
            class="btn-view"
          />
        </div>
      </div>
      <!--aqui -->
      <div class="q-ml-md">
        <div
          class="flex q-col-gutter-md"
        >
          <div class="flex">
            <q-skeleton
              type="QAvatar"
              class="q-mr-sm"
            />
            <q-skeleton type="QAvatar" />
          </div>

          <div class=" flex justify-end items-end margin q-gutter-md">
            <q-icon
              name="more_horiz"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
            <q-icon
              name="favorite_border"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
          </div>
        </div>
        <div class="q-ml-md q-mt-sm">
          <q-skeleton
            height="250px"
            width="280px"
            square
          />
        </div>
        <div class="q-ml-md">
          <q-skeleton
            type="text"
            width="200px"
          />
          <q-skeleton
            type="text"
            width="230px"
          />
          <q-skeleton
            type="QBtn"
            class="btn-view"
          />
        </div>
      </div>
      <div class="q-ml-md">
        <div
          class="flex q-col-gutter-md"
        >
          <div class="flex">
            <q-skeleton
              type="QAvatar"
              class="q-mr-sm"
            />
            <q-skeleton type="QAvatar" />
          </div>

          <div class=" flex justify-end items-end margin q-gutter-md">
            <q-icon
              name="more_horiz"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
            <q-icon
              name="favorite_border"
              color="grey-4"
              class="q-mr-sm q-mt-md"
              size="30px"
            />
          </div>
        </div>
        <div class="q-ml-md q-mt-sm">
          <q-skeleton
            height="250px"
            width="280px"
            square
          />
        </div>
        <div class="q-ml-md">
          <q-skeleton
            type="text"
            width="200px"
          />
          <q-skeleton
            type="text"
            width="230px"
          />
          <q-skeleton
            type="QBtn"
            class="btn-view"
          />
        </div>
      </div>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        :max="5"
        direction-links
        outline
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class GallerySkeleton extends Vue {

}
</script>
<style lang="scss" scoped>
.category {
  font-weight: bold;
}

.footer {
  display: flex;
}

.header {
  display: flex;
  justify-content: space-between;
}
.margin{
  margin-left:100px
}
.btn-view{
  width:260px;
  border-radius:12px;
}
.btn-unselected{
  width: 100px;
  height: 44px;
  color: #333;
  font-weight: bold;
  border: 1px solid rgb(185, 185, 185);
}
.btn-gwei{
  width: 170px;
  height: 44px;
}

.btn-selected {
  width: 100px;
  height: 44px;
  color: #333;
  font-weight: bold;
  border: 2px solid #f4538d;
}

.btn {
  width: 100px;
  height: 44px;
  min-width: 150px;
}

.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
@media (max-width: 420px) {
  .btn-size {
    min-width: 150px;
    float: left;
  }
  .header{
    display: flex;
    flex-direction: column-reverse;
  }
  .left{
    float: bottom;
  }
  .right{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .btn-collection{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

</style>
