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
            width="190px"
          />
          <q-skeleton width="150px" />
          <q-skeleton
            width="150px"
            height="60px"
          />
        </div>
      </div>
      <div class="flex">
        <div class="q-gutter-md flex column justify-center q-ml-xl">
          <q-skeleton
            width="190px"
            height="40px"
            class="q-mb-md"
          />
          <q-skeleton
            class="q-mx-auto"
            height="80px"
            width="50px"
          />
        </div>
        <div class="q-gutter-md flex column justify-center q-ml-xl q-pr-xl">
          <q-skeleton
            width="190px"
            height="40px"
          />
          <q-skeleton
            class="q-mx-auto"
            height="40px"
            width="100px"
          />
          <q-skeleton
            type="Qbtn"
            height="40px"
            width="190px"
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
            width="190px"
            class="q-mx-auto"
          />
          <q-skeleton
            width="150px"
            class="q-mx-auto"
          />
          <q-skeleton
            width="150px"
            height="60px"
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
        <div class="q-gutter-md flex column">
          <q-skeleton
            width="190px"
            height="40px"
            class="q-mx-auto q-mt-lg"
          />
          <q-skeleton
            class="q-mx-auto"
            height="40px"
            width="100px"
          />
          <q-skeleton
            type="Qbtn"
            class="q-mx-auto"
            height="40px"
            width="190px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class AccountDetailsSkeleton extends Vue {

}
</script>
