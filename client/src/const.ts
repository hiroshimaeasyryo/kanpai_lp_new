export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** 画像管理画面に入るためのアクセスコード */
export const IMAGE_MANAGER_ACCESS_CODE = "image-manager";
const SESSION_KEY = "image_manager_unlocked";

export function isImageManagerUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setImageManagerUnlocked(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
