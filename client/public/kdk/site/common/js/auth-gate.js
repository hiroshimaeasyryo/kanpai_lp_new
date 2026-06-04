/* KDK mockup access gate (client-side). */
(function () {
  var SESSION_KEY = "kdk_mockup_unlocked";

  function isGatePath(path) {
    return path === "/kdk" || path === "/kdk/" || path === "/kdk/index.html";
  }

  function buildNextPath() {
    var path = window.location.pathname || "";
    if (!path.startsWith("/kdk/site/")) return null;
    if (isGatePath(path)) return null;
    return path;
  }

  try {
    var path = window.location.pathname || "";
    if (!path.startsWith("/kdk")) return;
    if (isGatePath(path)) return;

    if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;

    var nextPath = buildNextPath();
    if (!nextPath) {
      window.location.replace("/kdk/");
      return;
    }

    window.location.replace("/kdk/?next=" + encodeURIComponent(nextPath));
  } catch (e) {
    window.location.replace("/kdk/");
  }
})();
