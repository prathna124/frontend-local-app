import axios from "axios";
import { Platform } from "react-native";

/**
 * Central API base URL for `import api from "../api/api"`.
 *
 * Local testing (quick reference):
 * - Android emulator: 10.0.2.2 = your PC’s localhost (default below).
 * - iOS Simulator: localhost works (default below).
 * - Physical phone (Expo Go / dev build): same Wi‑Fi as PC, set LOCAL_API_ROOT
 *   to your PC’s LAN IP, e.g. http://192.168.1.5:3000/api (Windows: ipconfig → IPv4).
 * - Port/path must match your backend (often :3000 and /api prefix).
 */
const STAGING_BASE_URL = "https://staging.apnadukan.com/api";

const defaultLocalBase = "http://10.98.61.172:3000/api";

/** Change this if you test on a real device or your server uses another host. */
const LOCAL_API_ROOT = defaultLocalBase;

const baseURL = LOCAL_API_ROOT;

/**
 * Must match your backend `x-api-token` check (string).
 * Default matches your server; override with `.env`: EXPO_PUBLIC_X_API_TOKEN=...
 */
const DEFAULT_X_API_TOKEN = "456";

export const X_API_TOKEN = String(
  (process.env.EXPO_PUBLIC_X_API_TOKEN ?? "").trim() || DEFAULT_X_API_TOKEN
);

/** Headers for auth routes that require `x-api-token` (login/register). */
export function getApiTokenHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-token": X_API_TOKEN,
  };
}

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (__DEV__) {
  api.interceptors.request.use((config) => {
    const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log("[api] request →", config.method?.toUpperCase(), fullUrl);
    return config;
  });
  api.interceptors.response.use(
    (res) => {
      console.log("[api] response ←", res.status, res.config?.url);
      return res;
    },
    (err) => {
      const status = err.response?.status;
      const data = err.response?.data;
      console.log("[api] error ←", status, err.config?.url, data ?? err.message);
      return Promise.reject(err);
    }
  );
}

/** Same string axios uses — use for full URLs if a screen still uses axios directly. */
export const API_BASE_URL = baseURL;

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
