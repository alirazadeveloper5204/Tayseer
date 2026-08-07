import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { NavigationLoaderService } from './navigation-loader.service';


export const pageTransitionGuard: CanActivateChildFn = () =>
  inject(NavigationLoaderService).waitUntilCovered();
