<template>
  <slot>
    <div :class="[wrappingMargin ? 'error row q-my-md' :'error row q-mt-lg']">
      <div class="col-2 flex">
        <slot name="icon">
          <q-avatar
            size="60px"
            color="negative"
            class="icon self-center"
            text-color="white"
          >
            <q-icon name="mdi-alert-circle" />
          </q-avatar>
        </slot>
      </div>
      <div class="col-10 self-center message">
        {{ errorMsg }}
      </div>
    </div>
  </slot>
</template>

<script>
import { Vue, prop } from 'vue-class-component';

class Props {
  errorMsg = prop({
    type: String,
    required: true
  });

  wrappingMargin = prop({
    type: String,
    required: false
  });
}

export default class Error extends Vue.with(Props) {}
</script>

<style lang="scss" scoped>
  .error {
    padding: 10px;
    border: $primary solid 1px;
    border-radius: 5px;
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    .error {
      .icon {
        font-size: 45px !important;
      }
      .message {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 360px) {
    .error {
      .icon {
        font-size: 40px !important;
      }
    }
  }

  @media (max-width: 280px) {
    .error {
      .icon {
        font-size: 28px !important;
      }
      .message {
        font-size: 10px;
      }
    }
  }
</style>