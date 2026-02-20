import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 画像キャッシュ用 Service Worker（本番のみ登録）
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
