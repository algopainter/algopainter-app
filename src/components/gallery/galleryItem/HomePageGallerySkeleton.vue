<template>
  <div class="flex desktop-only">
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-mr-sm"
    />
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-mr-sm"
    />
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-mr-sx"
    />
  </div>
  <div class="flex mobile-only">
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-ma-xs"
    />
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-ma-xs"
    />
    <q-skeleton
      type="QBtn"
      width="200px"
      height="50px"
      class="custom-skeleton-border q-ma-xs"
    />
  </div>
  <div class="flex">
    <div
      v-for="(item, index) in 8"
      :key="index"
    >
      <div class="q-pr-lg">
        <q-card
          style="max-width: 300px"
          flat
        >
          <q-item class="row justify-between">
            <div class="row">
              <q-item-section>
                <q-skeleton
                  class="q-ma-none"
                  type="circle"
                />
              </q-item-section>
              <q-item-section>
                <q-skeleton
                  class="q-ma-none"
                  type="circle"
                />
              </q-item-section>
            </div>
            <div>
              <div class="flex">
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
          </q-item>

          <q-skeleton
            height="275px"
            width="275px"
          />

          <q-card-actions
            align="right"
            class="q-gutter-md"
          >
            <q-item-section>
              <q-item-label>
                <q-skeleton
                  type="text"
                  animation="fade"
                />
                <q-skeleton
                  type="text"
                  animation="fade"
                />
                <q-skeleton
                  type="text"
                  animation="fade"
                />
                <q-skeleton
                  type="text"
                  animation="fade"
                />
              </q-item-label>
            </q-item-section>
          </q-card-actions>
          <q-card-actions
            align="right"
            class="q-gutter-md"
          >
            <q-skeleton
              type="QBtn"
              width="100%"
              class="custom-skeleton-border"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue } from 'vue-class-component';

export default class HomePageGallerySkeleton extends Vue {

}
</script>
