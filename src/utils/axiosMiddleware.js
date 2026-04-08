import { logout } from "@/redux/reducers/authSlice";
import axios from "axios";
import { deleteCookie } from "./utils";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

let store;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;
const retryDelayMilliseconds = 1000;

export const injectStore = (_store) => {
  store = _store;
};

export function getAccessTokenCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value?.split(`; ${name}=`);
  if (parts?.length === 2) {
    return parts?.pop()?.split(";")?.shift();
  }
}

const refreshToken = () => {
  return instance.post("/auth/refresh").catch((error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      deleteCookie("refresh_token");
    }

    return Promise.reject(error);
  });
};

instance.interceptors.request.use(function (config) {
  const access_token = getAccessTokenCookie("access_token");

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const validLanguage =
    language && (language === "en" || language === "no") ? language : "en";

  config.headers["Accept-Language"] = validLanguage;

  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.message === "Unauthorized"
      ) {
        const access_token = getAccessTokenCookie("access_token");
        if (access_token) {
          deleteCookie("access_token");
          const refresh_token = getAccessTokenCookie("refresh_token");
          if (refresh_token && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
            instance.defaults.headers.Authorization = `Bearer ${refresh_token}`;
            refreshAttempts++;

            return refreshToken()
              .then((res) => {
                const token = res?.data?.access_token;
                document.cookie = `access_token=${token}; path=/`;

                instance.defaults.headers.Authorization = `Bearer ${token}`;

                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(instance(error.config));
                  }, retryDelayMilliseconds);
                });
              })
              .catch(() => {
                window.location.reload();
                window.location.replace("/login");
                refreshAttempts = 0;

                return Promise.reject(error);
              });
          }
        } else {
          refreshAttempts = 0;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
