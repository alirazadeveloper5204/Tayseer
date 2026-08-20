import { UrlMatcher, UrlSegment } from '@angular/router';

/** Only `/en` and `/ar` consume the locale route — anything else falls through to 404. */
export const localeMatcher: UrlMatcher = (segments: UrlSegment[]) => {
  if (segments.length === 0) {
    return null;
  }
  const lang = segments[0].path;
  if (lang !== 'en' && lang !== 'ar') {
    return null;
  }
  return {
    consumed: [segments[0]],
    posParams: { lang: segments[0] },
  };
};
