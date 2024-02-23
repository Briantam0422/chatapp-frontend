import router, { WHITE_NAME_LIST } from "./index";
import { getCookies } from "../utils/cookie";
import { useUserStore } from "../stores/user";

router.beforeEach(async (to, from, next) => {
  const hasToken = getCookies("token");
  const userStore = useUserStore();
  if (hasToken == null || hasToken === "" || hasToken === undefined) {
    if (WHITE_NAME_LIST.indexOf(to.name) !== -1) {
      // pages that auth are not required
      next();
    }
    // Not Authenticated
    next("/login");
  } else {
    userStore.isAuth();
    next();
  }
});
