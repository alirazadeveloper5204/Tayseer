import { RESPONSE_INIT, inject } from '@angular/core';

export function injectSsrResponseInit(): ResponseInit | null {
  return inject(RESPONSE_INIT, { optional: true }) ?? null;
}

export function setSsrStatus(responseInit: ResponseInit | null, status: number): void {
  if (responseInit) {
    responseInit.status = status;
  }
}
