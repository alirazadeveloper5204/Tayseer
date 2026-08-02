import { Component, inject } from '@angular/core';
import { NavigationLoaderService } from '../../../core/navigation/navigation-loader.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.css',
})
export class PageLoader {
  readonly loader = inject(NavigationLoaderService);
}
