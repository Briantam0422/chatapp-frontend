import { useErrorsStore } from "../stores/errors";
import { useUserStore } from "../stores/user";
import { useCookies } from "vue3-cookies";

export async function isAuth(to, from, next) {
  const errorsStore = useErrorsStore();
  const userStore = useUserStore();
  const { cookies } = useCookies();
  const exceptRoutes = ["login", "register"];
  if (userStore.user.isLoggedIn) {
    return next();
  }
  if (!exceptRoutes.includes(to.name)) {
    let token = cookies.get("token");
    if (token === "" || token === undefined) {
      userStore.user.isLoggedIn = false;
      return next("/login");
    }
    try {
      let res = await fetch("http://localhost:8080/isAuth", {
        method: "GET",
        credentials: "include",
      });
      let data = await res.json();
      // console.log(data);
      if (!res.ok || data.status !== "ok") {
        let err = errorsStore.createErr(
          "Unauthorized",
          data.message,
          "bg-warning"
        );
        errorsStore.addErr(err);
        userStore.isLoggedIn = false;
        return next("/login");
      }
      userStore.isLoggedIn = true;
      // console.log("isAuth");
      return next("/chat");
    } catch (e) {
      console.log(e);
      errorsStore.addServerErr();
      userStore.isLoggedIn = false;
      return next("/login");
    }
  }
  next();
}
