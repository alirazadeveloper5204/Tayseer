import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { NavigationLoaderService } from './navigation-loader.service';

/**
 * Holds the next page until the loading overlay has faded in over the current one.
 */
export const pageTransitionGuard: CanActivateChildFn = () =>
  inject(NavigationLoaderService).waitUntilCovered();
