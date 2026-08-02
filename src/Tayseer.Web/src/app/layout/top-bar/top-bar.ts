import { Component, inject } from '@angular/core';
import { UiCopyService } from '../../core/i18n/ui-copy.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  readonly copy = inject(UiCopyService).copy;
}
