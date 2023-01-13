import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        username: "",
        token: "",
      },
    };
  },
  getters: {
    getUsername: (state) => state.user.username,
  },
  actions: {},
});
