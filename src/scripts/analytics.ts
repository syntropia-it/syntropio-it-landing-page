/**
 * Analytics Module - GA4 + Clarity + Custom Event Tracking
 * Provides unified event tracking across Samana Transformaciones site
 */

export enum AnalyticsEvent {
  // Navigation
  NAV_CLICK = "nav_click",
  FOOTER_LINK = "footer_link",

  // Conversion & Form
  FORM_START = "form_start",
  FORM_STEP = "form_step_completed",
  FORM_SUBMIT = "form_submit",
  FORM_ERROR = "form_error",

  // Contact Intent
  PHONE_CLICK = "phone_click",
  EMAIL_CLICK = "email_click",
  WHATSAPP_CLICK = "whatsapp_click",

  // Engagement
  SCROLL_DEPTH = "scroll_depth",
  VIDEO_PLAY = "video_play",
  IMAGE_ZOOM = "image_zoom",

  // Project/Service Views
  PROJECT_VIEW = "project_view",
  SERVICE_VIEW = "service_view",

  // Downloads
  DOWNLOAD_BROCHURE = "download_brochure",
  DOWNLOAD_PDF = "download_pdf",
}

interface EventParams {
  [key: string]: string | number | boolean | null;
}

/**
 * Initialize Google Analytics 4
 * Must be called once on page load
 */
export function initGoogleAnalytics(gaId: string): void {
  if (typeof window === "undefined") return;

  // Inject GA4 script tag
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", gaId, {
    page_path: window.location.pathname,
    page_title: document.title,
  });

  (window as any).gtag = gtag;
}

/**
 * Track custom event to Google Analytics 4
 */
export function trackEvent(
  event: AnalyticsEvent | string,
  params?: EventParams,
): void {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) {
    if (import.meta.env.DEV) {
      console.warn("GA4 not initialized. Call initGoogleAnalytics() first.");
    }
    return;
  }

  gtag("event", event, {
    ...(params || {}),
    timestamp: new Date().toISOString(),
  });

  // Dev logging
  if (import.meta.env.DEV) {
    console.log(`📊 Event: ${event}`, params || {});
  }
}

/**
 * Track form submission with metadata
 */
export function trackFormSubmit(
  formName: string,
  data: {
    type?: string;
    property?: string;
    area?: string;
    name?: string;
    email?: string;
  },
): void {
  trackEvent(AnalyticsEvent.FORM_SUBMIT, {
    form_name: formName,
    service_type: data.type || "unknown",
    property_type: data.property || "unknown",
    area_type: data.area || "unknown",
    user_email: data.email || "anonymous",
  });
}

/**
 * Track form step completion (multi-step forms)
 */
export function trackFormStep(
  formName: string,
  stepNumber: number,
  stepName: string,
): void {
  trackEvent(AnalyticsEvent.FORM_STEP, {
    form_name: formName,
    step_number: stepNumber,
    step_name: stepName,
  });
}

/**
 * Track scroll depth to understand engagement
 * @param threshold Percentage (25, 50, 75, 100)
 */
export function trackScrollDepth(threshold: number): void {
  trackEvent(AnalyticsEvent.SCROLL_DEPTH, {
    scroll_depth: `${threshold}%`,
    page_path: window.location.pathname,
  });
}

/**
 * Initialize scroll depth tracking (call once per page)
 */
export function initScrollTracking(): void {
  if (typeof window === "undefined") return;

  const thresholds = [0.25, 0.5, 0.75, 1.0];
  const tracked = new Set<number>();

  const checkScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const percentage = scrolled / total;

    thresholds.forEach((threshold) => {
      if (percentage >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        trackScrollDepth(Math.round(threshold * 100));
      }
    });
  };

  window.addEventListener("scroll", checkScroll, { passive: true });
}

/**
 * Track CTA clicks with context
 */
export function trackCTA(
  ctaText: string,
  ctaType: "button" | "link" = "button",
): void {
  trackEvent("cta_click", {
    cta_text: ctaText,
    cta_type: ctaType,
    page_path: window.location.pathname,
  });
}

/**
 * Track phone/email clicks for lead intent
 */
export function trackContactIntent(
  method: "phone" | "email" | "whatsapp",
  value?: string,
): void {
  const eventMap = {
    phone: AnalyticsEvent.PHONE_CLICK,
    email: AnalyticsEvent.EMAIL_CLICK,
    whatsapp: AnalyticsEvent.WHATSAPP_CLICK,
  };

  trackEvent(eventMap[method], {
    contact_value: value || "hidden",
  });
}

/**
 * Initialize Microsoft Clarity (optional, if using)
 */
export function initClarity(clarityId: string): void {
  if (typeof window === "undefined") return;

  (function (c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", clarityId);
}

/**
 * Auto-setup: Attach to common interactive elements
 */
export function setupAutoTracking(): void {
  if (typeof window === "undefined") return;

  // Track all CTA buttons
  document.querySelectorAll("[data-track-cta]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const text =
        (el as HTMLElement).textContent?.trim() ||
        (el as HTMLElement).getAttribute("data-track-cta");
      trackCTA(text || "unknown-cta");
    });
  });

  // Track contact method clicks (phone, email, WhatsApp)
  document
    .querySelectorAll("[data-track-contact]")
    .forEach((el: HTMLElement) => {
      const method = el.getAttribute("data-track-contact") as any;
      const value = el
        .getAttribute("href")
        ?.replace(/^(tel|mailto|https?):\/?\/?/, "");

      el.addEventListener("click", () => {
        trackContactIntent(method, value);
      });
    });

  // Track project/service links
  document.querySelectorAll("[data-track-view]").forEach((el) => {
    const viewType = (el as HTMLElement).getAttribute("data-track-view");
    el.addEventListener("click", () => {
      trackEvent(
        viewType === "project"
          ? AnalyticsEvent.PROJECT_VIEW
          : AnalyticsEvent.SERVICE_VIEW,
        {
          item_name: (el as HTMLElement).textContent?.trim() || "unknown",
        },
      );
    });
  });
}

/**
 * Initialize all analytics on page load
 */
export function initializeAnalytics(gaId?: string, clarityId?: string): void {
  if (typeof window === "undefined") return;

  // Initialize GA4 (required)
  if (gaId) {
    initGoogleAnalytics(gaId);
  }

  // Initialize Clarity (optional)
  if (clarityId) {
    initClarity(clarityId);
  }

  // Setup auto-tracking on interactive elements
  setupAutoTracking();

  // Setup scroll depth tracking
  initScrollTracking();

  if (import.meta.env.DEV) {
    console.log("✅ Analytics initialized");
  }
}
