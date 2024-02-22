import { useCookies } from "vue3-cookies";

export const getCookies = (key) => {
  const { cookies } = useCookies();
  return cookies.get(key);
};

export const setCookies = (key, value) => {
  const { cookies } = useCookies();
  cookies.set(key, value);
};

export const deleteCookies = (key) => {
  const { cookies } = useCookies();
  cookies.set(key, "");
};
