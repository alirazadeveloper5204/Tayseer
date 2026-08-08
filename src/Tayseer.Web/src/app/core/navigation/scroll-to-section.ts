import { isPlatformBrowser } from '@angular/common';


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

  const url = `${window.location.pathname}${window.location.search}#${sectionId}`;
  history.replaceState(null, '', url);
}
