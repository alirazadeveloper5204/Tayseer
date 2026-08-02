import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLoader } from './shared/ui/page-loader/page-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLoader],
  template: `
    <app-page-loader />
    <router-outlet />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class App {}
