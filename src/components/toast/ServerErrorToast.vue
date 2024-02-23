<script>
import { Toast } from "bootstrap";
import { ref } from "vue";
import moment from "moment";
import { useErrorsStore } from "../../stores/errors";

export default {
  props: {
    err: {
      type: Object,
      default: Object,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const errorsStore = useErrorsStore();
    let timeAgo = ref(0);
    timeAgo.value = moment(Date.now()).fromNow();
    return {
      timeAgo,
      errorsStore,
    };
  },
  mounted() {
    let toast = new Toast(this.$refs.el);
    toast.show();
    this.errorsStore.deleteAllErrs();
  },
};
</script>

<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div class="toast-container position-absolute top-0 end-0">
      <div
        ref="el"
        class="toast"
        :class="[err.style]"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ err.headerTitle }}</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body text-bold">{{ err.message }}</div>
      </div>
    </div>
  </div>
</template>

<style></style>
