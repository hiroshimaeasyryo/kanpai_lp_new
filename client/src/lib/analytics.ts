const CLARITY_PROJECT_ID = "xtzphj5f31";
const GA4_MEASUREMENT_ID = "G-G61CZLLN9T";
const CONTENTS_MANAGER_PATH = "/contents-manager";

type AnalyticsArguments = unknown[];

type ClarityFunction = ((...args: AnalyticsArguments) => void) & {
  q?: AnalyticsArguments[];
};

declare global {
  interface Window {
    clarity?: ClarityFunction;
    dataLayer?: AnalyticsArguments[];
    gtag?: (...args: AnalyticsArguments) => void;
  }
}

let analyticsInitialized = false;

function debugAnalytics(eventName: string, parameters: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${eventName}`, JSON.stringify(parameters));
  }
}

export function isAnalyticsExcludedPath(pathname: string) {
  return pathname === CONTENTS_MANAGER_PATH || pathname.startsWith(`${CONTENTS_MANAGER_PATH}/`);
}

function isAnalyticsEnabled() {
  return typeof window !== "undefined" && !isAnalyticsExcludedPath(window.location.pathname);
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGoogleAnalytics() {
  window.dataLayer ??= [];
  window.gtag ??= (...args: AnalyticsArguments) => {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID);
  loadScript("ga4-gtag", `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`);
}

function initClarity() {
  if (!window.clarity) {
    const clarity: ClarityFunction = (...args: AnalyticsArguments) => {
      (clarity.q ??= []).push(args);
    };
    window.clarity = clarity;
  }

  loadScript("microsoft-clarity", `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`);
}

export function initializeAnalytics() {
  if (analyticsInitialized || !isAnalyticsEnabled()) return;
  analyticsInitialized = true;

  initGoogleAnalytics();
  initClarity();
  debugAnalytics("initialized", {
    clarity_project_id: CLARITY_PROJECT_ID,
    ga4_measurement_id: GA4_MEASUREMENT_ID,
  });
}
