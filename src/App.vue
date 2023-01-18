<script>
import { useErrorsStore } from "./stores/errors";
import ServerErrorToast from "./components/toast/ServerErrorToast.vue";
// import {useUserStore} from "./stores/user";

export default {
  components: { ServerErrorToast },
  setup() {
    const errorsStore = useErrorsStore();


    let errs = errorsStore.errs;
    return {
      errorsStore,
      errs,
    };
  },
};
</script>

<template>
  <div v-if="errs.length > 0">
    <div v-for="(err, index) in errs" :key="index">
      <ServerErrorToast :err="err"></ServerErrorToast>
    </div>
  </div>
  <RouterView />
</template>

<style scoped></style>
