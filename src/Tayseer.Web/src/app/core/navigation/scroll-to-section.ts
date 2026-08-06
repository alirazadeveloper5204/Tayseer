import { isPlatformBrowser } from '@angular/common';

/** Same-page anchor scroll that avoids `<base href="/">` sending `#id` to home (`/`). */
export function scrollToSectionId(
  platformId: object,
  sectionId: string,
  event?: Event,
): void {
  event?.preventDefault();
  event?.stopPropagation();
  if (!isPlatformBrowser(platformId)) {
    return;
  }
  const el = document.getElementById(sectionId);
  if (!el) {
    return;
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Keep URL fragment without triggering a router navigation to `/`.
  const url = `${window.location.pathname}${window.location.search}#${sectionId}`;
  history.replaceState(null, '', url);
}
