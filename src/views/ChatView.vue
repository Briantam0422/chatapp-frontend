<script>
import {useUserStore} from "../stores/user";

export default {
  setup() {
    const userStore = useUserStore();
    userStore.isAuth();
    return {
      userStore,
    };
  },
};
</script>

<template>
  <div>
    ChatView
  </div>
</template>

<style></style>