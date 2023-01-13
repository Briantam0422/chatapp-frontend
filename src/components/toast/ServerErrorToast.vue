<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-absolute top-0 end-0">
      <div
        ref="el"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">Message</strong>
<!--          <small class="text-muted">{{ timeAgo }}</small>-->
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">{{ err }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "bootstrap";
import { ref } from "vue";
import moment from "moment";

export default {
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    err: "",
  },
  setup() {
    let timeAgo = ref(0);
    timeAgo.value = moment(Date.now()).fromNow();
    return {
      timeAgo,
    };
  },
  mounted() {
    let toast = new Toast(this.$refs.el);
    toast.show();
  },
};
</script>

<style></style>
