export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** 画像管理画面に入るためのアクセスコード（後方互換・/image-manager リダイレクト用） */
export const IMAGE_MANAGER_ACCESS_CODE = "image-manager";

/** コンテンツ管理画面（/contents-manager）に入るためのアクセスコード */
export const CONTENTS_MANAGER_ACCESS_CODE = "contents-manager";

const IMAGE_MANAGER_SESSION_KEY = "image_manager_unlocked";
const CONTENTS_MANAGER_SESSION_KEY = "contents_manager_unlocked";

export function isImageManagerUnlocked(): boolean {
  return sessionStorage.getItem(IMAGE_MANAGER_SESSION_KEY) === "1";
}

export function setImageManagerUnlocked(): void {
  sessionStorage.setItem(IMAGE_MANAGER_SESSION_KEY, "1");
}

export function isContentsManagerUnlocked(): boolean {
  return sessionStorage.getItem(CONTENTS_MANAGER_SESSION_KEY) === "1";
}

export function setContentsManagerUnlocked(): void {
  sessionStorage.setItem(CONTENTS_MANAGER_SESSION_KEY, "1");
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
