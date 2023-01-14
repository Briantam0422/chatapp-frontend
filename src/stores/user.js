import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useErrorsStore } from "./errors";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        username: "",
        token: "",
        isLoggedIn: false,
      },
    };
  },
  getters: {
    // getUsername: (state) => state.user.username,
    // getIsLoggedIn: (state) => state.user.isLoggedIn,
  },
  actions: {
    login: async function (username, password) {
      const errorsStore = useErrorsStore();
      if (username === "" || username === undefined) {
        let err = errorsStore.createErr(
          "Warning",
          "Please enter username",
          "bg-warning"
        );
        errorsStore.addErr(err);
        return;
      }
      if (password === "" || password === undefined) {
        let err = errorsStore.createErr(
          "Warning",
          "Please enter password",
          "bg-warning"
        );
        errorsStore.addErr(err);
        return;
      }
      try {
        const { cookies } = useCookies();
        let input = {
          username: username,
          password: password,
        };
        let res = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(input),
        });
        var data = await res.json();
        if (res.ok && data.status === "ok") {
          if (data.token !== "") {
            cookies.set("token", data.token);
          }
          this.user.username = data.username;
          this.user.token = data.token;
          this.user.isLoggedIn = true;
        } else {
          let err = errorsStore.createErr(
            "Warning",
            data.message,
            "bg-warning"
          );
          errorsStore.addErr(err);
        }
      } catch (e) {
        console.log("error login: ", e);
      }
    },
  },
});
