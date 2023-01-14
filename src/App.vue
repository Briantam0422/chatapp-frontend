<script>
import { useUserStore } from "./stores/user";
import router from "./router";

export default {
  setup() {
    let userStore = useUserStore();
    return {
      userStore,
    };
  },
  async mounted() {
    await this.userStore.isAuth();
    // console.log("isLoggedIn: " + await this.userStore.user.isLoggedIn);
    if (!this.userStore.user.isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/chat");
    }
  },
};
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
