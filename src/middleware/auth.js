import { useErrorsStore } from "../stores/errors";
import { useCookies } from "vue3-cookies";

export async function isAuth(to, from, next) {
  const errorsStore = useErrorsStore();
  const { cookies } = useCookies();
  let token = cookies.get("token");
  let isAuthed;
  if (token === "" || token === undefined || token === null) {
    isAuthed = false;
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
        isAuthed = false;
      } else {
        isAuthed = true;
      }
    } catch (e) {
      console.log(e);
      errorsStore.addServerErr();
      isAuthed = false;
    }
  }

  if (isAuthed) {
    console.log("isAuthed", isAuthed);
    return next();
  } else {
    console.log("isAuthed", isAuthed);
    return next("/login");
  }
}
