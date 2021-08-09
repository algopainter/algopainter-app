<template>
  <div
    id="q-app"
    style="width: 100%"
    class="desktop-only"
  >
    <div class="flex justify-between">
      <div class="q-pa-md">
        <div class="q-gutter-md">
          <q-skeleton
            type="circle"
            size="190px"
          />
          <q-skeleton
            width="300px"
            height="50px"
          />
          <q-skeleton width="150px" />
        </div>
      </div>
      <div class="flex">
        <div class="q-gutter-md flex column justify-center q-mr-xl">
          <q-skeleton
            width="250px"
            height="50px"
            class="q-mx-auto"
          />
          <q-skeleton
            class="q-mx-auto"
            height="80px"
            width="50px"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    id="q-app"
    style="width: 100%"
    class="mobile-only"
  >
    <div>
      <div
        class="q-pa-md"
        style="width:100%"
      >
        <div class="q-gutter-md flex column">
          <q-skeleton
            type="circle"
            size="190px"
            class="q-mx-auto"
          />
          <q-skeleton
            width="250px"
            height="50px"
            class="q-mx-auto"
          />
          <q-skeleton
            width="150px"
            class="q-mx-auto"
          />
        </div>
      </div>
      <div
        style="width:100%"
      >
        <div class="q-gutter-md flex column">
          <q-skeleton
            width="190px"
            height="40px"
            class="q-mx-auto"
          />
          <q-skeleton
            class="q-mx-auto"
            height="80px"
            width="50px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class UserAccountDetailsSkeleton extends Vue {

}
</script>
