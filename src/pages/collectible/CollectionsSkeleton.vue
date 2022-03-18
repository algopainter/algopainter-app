<template>
  <div class="row justify-center">
    <div class="container-avatar">
      <q-skeleton type="circle" width="200px" height="200px" class="img" />
      <div class="q-mt-md q-ml-md row justify-center">
        <q-skeleton width="100px" height="20px" />
      </div>
    </div>
    <div class="description q-gutter-md">
      <q-skeleton height="100px" />

      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-evenly q-gutter-sm']">
        <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" />
      </div>
    </div>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'btn' : 'btn']">
      <q-skeleton type="QChip" width="170px" height="40px" />
    </div>
  </div>
  <div class="row justify-center">
    <div class="container-avatar">
      <q-skeleton type="circle" width="200px" height="200px" class="img" />
      <div class="q-mt-md q-ml-md row justify-center">
        <q-skeleton width="100px" height="20px" />
      </div>
    </div>
    <div class="description q-gutter-md">
      <q-skeleton height="100px" />

      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-evenly q-gutter-sm']">
        <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" />
      </div>
    </div>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'btn' : 'btn']">
      <q-skeleton type="QChip" width="170px" height="40px" />
    </div>
  </div>
  <div class="row justify-center">
    <div class="container-avatar">
      <q-skeleton type="circle" width="200px" height="200px" class="img" />
      <div class="q-mt-md q-ml-md row justify-center">
        <q-skeleton width="100px" height="20px" />
      </div>
    </div>
    <div class="description q-gutter-md">
      <q-skeleton height="100px" />

      <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'column items-center q-pb-sm' : 'row justify-evenly q-gutter-sm']">
        <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" /> <q-skeleton width="150px" height="100px" class="q-mt-sm" />
      </div>
    </div>
    <div :class="[$q.screen.lt.md || $q.screen.lt.sm ? 'btn' : 'btn']">
      <q-skeleton type="QChip" width="170px" height="40px" />
    </div>
  </div>
</template>

<script>
import { Vue } from 'vue-class-component';

export default class CollectionsSkeleton extends Vue {

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
    width: 210px;
    height: 210px;
    border-radius: 50%;
}
.description{
    width: 500px;
    margin-top: 38px;
    margin-left: 20px;

}
.btn{
    margin-top: 150px;
    margin-left: 50px;
}

  @media(max-width: 889px) {
    .description{
      margin-top: 0;
      margin-left: 0;

    }
    .btn{
      margin-top: 0;
      margin-bottom: 15px;
      margin-left: 15px;

    }
  }

    @media(max-width: 500px) {
    .description{
      margin-top: 0;
      margin-left: 0;
    }

    .btn{
      margin-top: 0;
      margin-bottom: 15px;
      margin-left: 15px;

    }
  }
</style>