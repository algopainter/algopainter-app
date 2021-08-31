<template>
  <div>
    <q-page class="row q-pb-lg xl">
      <div
        v-for="(item, i) in 9"
        :key="i"
        class="row"
      >
        <div class="q-mb-sm">
          <div
            class="flex q-col-gutter-md"
          >
            <div class="flex q-ml-md">
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
                size="25px"
              />
              <q-icon
                name="favorite_border"
                color="grey-4"
                class="q-mr-sm q-mt-md"
                size="25px"
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
              width="200px"
            />
            <q-skeleton
              type="QBtn"
              class="btn-view"
            />
          </div>
        </div>
      </div>
    </q-page>
    <q-page class="row q-pb-lg md">
      <div
        v-for="(item, i) in 9"
        :key="i"
        class="row"
      >
        <div class="q-mb-sm">
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
                size="25px"
              />
              <q-icon
                name="favorite_border"
                color="grey-4"
                class="q-mr-sm q-mt-md"
                size="25px"
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
              width="200px"
            />
            <q-skeleton
              type="QBtn"
              class="btn-view"
            />
          </div>
        </div>
      </div>
    </q-page>
    <q-page class="row q-pb-lg mobile-only">
      <div
        v-for="(item, i) in 9"
        :key="i"
        class="row"
      >
        <div class="q-mb-sm">
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
                size="25px"
              />
              <q-icon
                name="favorite_border"
                color="grey-4"
                class="q-mr-sm q-mt-md"
                size="25px"
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
              width="200px"
            />
            <q-skeleton
              type="QBtn"
              class="btn-view"
            />
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class MyGallerySkeleton extends Vue {}
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
  margin-left:80px
}
.btn-view{
  width:270px;
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
  width: 80px;
  height: 44px;
  min-width: 150px;
}
.btn-grey {
  color: rgb(185, 185, 185);
  border: 1px solid rgb(185, 185, 185);
}
@media (max-width: 420px) {
  .btn-size {
    min-width: 130px;
    float: left;
  }
  .header{
    display: flex;
    flex-direction: column-reverse;
  }
  .left{
    float: bottom;
  }
  .margin{
    margin-left: 70px
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
