import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useErrorsStore } from "./errors";
import { useRoute, useRouter } from "vue-router/dist/vue-router";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        id: null,
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
    isAuth: async function () {
      const errorsStore = useErrorsStore();
      const router = useRouter();
      const route = useRoute();
      console.log(route.name);
      const exceptRoutes = ["register"];
      const { cookies } = useCookies();
      let token = cookies.get("token");
      if (token === "" || token === undefined) {
        this.user.isLoggedIn = false;
      } else {
        try {
          let res = await fetch("http://localhost:8080/isAuth", {
            method: "GET",
            credentials: "include",
          });
          let data = await res.json();
          console.log(data);
          if (!res.ok || data.status !== "ok") {
            let err = errorsStore.createErr(
              "Unauthorized",
              data.message,
              "bg-warning"
            );
            errorsStore.addErr(err);
            this.user.isLoggedIn = false;
          } else {
            console.log("a");
            this.user.id = data.id;
            this.user.username = data.username;
            this.user.isLoggedIn = true;
          }
        } catch (e) {
          console.log(e);
          errorsStore.addServerErr();
          this.user.isLoggedIn = false;
        }
      }

      if (this.user.isLoggedIn) {
        router.push("/chat");
      } else {
        if (!exceptRoutes.includes(route.name)) {
          router.push("/login");
        } else {
          router.push(route.path);
        }
      }
    },
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
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(input),
        });
        var data = await res.json();
        // if request is not succeeded
        if (!res.ok || data.status !== "ok") {
          let err = errorsStore.createErr(
            "Warning",
            data.message,
            "bg-warning"
          );
          errorsStore.addErr(err);
          return;
        }
        // if request is succeeded
        if (data.token !== "") {
          cookies.set("token", data.token);
        }
        this.user.id = data.id;
        this.user.username = data.username;
        this.user.token = data.token;
        this.user.isLoggedIn = true;
      } catch (e) {
        errorsStore.addServerErr();
      }
    },
    register: async function (username, password) {
      const { cookies } = useCookies();
      let errorsStore = useErrorsStore();
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
      let input = {
        username: username,
        password: password,
      };
      try {
        let res = await fetch("http://localhost:8080/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(input),
        });
        let data = await res.json();
        // console.log(data);
        if (!res.ok || data.status !== "ok") {
          let err = errorsStore.createErr(
            "Warning",
            data.message,
            "bg-warning"
          );
          errorsStore.addErr(err);
          this.user.isLoggedIn = false;
          return;
        }
        // if request is succeeded
        if (data.token !== "") {
          cookies.set("token", data.token);
        }
        this.user.username = data.username;
        this.user.token = data.token;
        this.user.isLoggedIn = true;
      } catch (e) {
        errorsStore.addServerErr();
        this.user.isLoggedIn = false;
      }
    },
    logout: function () {
      const { cookies } = useCookies();
      cookies.set("token", "");
      console.log("logout")
    },
  },
});
