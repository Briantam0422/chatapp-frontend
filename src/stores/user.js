import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useErrorsStore } from "./errors";
import api_request from "../utils/api_request";
import RequestMethodEnum from "../Enums/RequestMethodEnum";
import router from "../router";

export const userObject = {
  id: null,
  username: "",
  token: "",
  isLoggedIn: false,
};

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: userObject,
    };
  },
  actions: {
    isAuth: async function () {
      // logged in
      const data = await api_request.request({
        url: "isAuth",
        method: RequestMethodEnum.GET,
      });
      if (data.id) {
        this.user.id = data.id;
        this.user.username = data.username;
        this.user.isLoggedIn = true;
        await router.push("/chat");
      } else {
        this.user.isLoggedIn = false;
        await router.push("/login");
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
      const { cookies } = useCookies();
      let input = {
        username: username,
        password: password,
      };
      const data = await api_request.request({
        url: "login",
        method: RequestMethodEnum.POST,
        body: input,
      });
      // console.log(data)
      // if request is succeeded
      if (data.token) {
        if (data.token !== "") {
          cookies.set("token", data.token);
        }
        this.user.id = data.id;
        this.user.username = data.username;
        this.user.token = data.token;
        this.user.isLoggedIn = true;
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
      const data = await api_request.request({
        url: "register",
        method: RequestMethodEnum.POST,
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: input,
      });
      if (data.token) {
        // if request is succeeded
        if (data.token !== "") {
          cookies.set("token", data.token);
        }
        this.user.username = data.username;
        this.user.token = data.token;
        this.user.isLoggedIn = true;
      }
    },
    logout: function () {
      const { cookies } = useCookies();
      cookies.set("token", "");
    },
  },
});
