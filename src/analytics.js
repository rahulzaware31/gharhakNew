// Thin wrapper around window.gtag — safe to call even if gtag hasn't loaded yet
export function trackPage(pagePath, pageTitle) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
