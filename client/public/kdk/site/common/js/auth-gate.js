/* KDK mockup access gate (client-side). */
(function () {
  try {
    var path = window.location.pathname || "";
    if (!path.startsWith("/kdk")) return;

    // Gate page (static) is /kdk/ (or /kdk). Don't loop.
    if (path === "/kdk" || path === "/kdk/") return;

    var unlocked = window.sessionStorage.getItem("kdk_mockup_unlocked") === "1";
    if (unlocked) return;

    var next = encodeURIComponent(
      window.location.pathname + window.location.search + window.location.hash,
    );
    window.location.replace("/kdk/?next=" + next);
  } catch (e) {
    // If anything fails, fall back to gate.
    window.location.replace("/kdk/");
  }
})();

