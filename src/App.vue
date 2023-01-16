<script>
import { useUserStore } from "./stores/user";
import { useErrorsStore } from "./stores/errors";
import ServerErrorToast from "./components/toast/ServerErrorToast.vue";

export default {
  components: { ServerErrorToast },
  setup() {
    const userStore = useUserStore();
    const errorsStore = useErrorsStore();
    const excludesRoute = ["login", "register"];
    const currentRoute = this.$route;
    console.log("excludesRoute: ", excludesRoute);
    console.log("currentRoute: ", currentRoute);
    console.log(!excludesRoute.includes(currentRoute));
    let errs = errorsStore.errs;
    return {
      userStore,
      errorsStore,
      errs,
      excludesRoute,
      currentRoute,
    };
  },
  async mounted() {
    // TODO CHECK ROUTE NAME
    await this.userStore.isAuth();
    if (!this.excludesRoute.includes(this.currentRoute)) {
      if (!this.userStore.user.isLoggedIn) {
        // router.push("/login");
      } else {
        // router.push("/chat");
      }
    }
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
