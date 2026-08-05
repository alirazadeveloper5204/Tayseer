import { Component, input } from '@angular/core';

@Component({
  selector: 'app-world-card',
  templateUrl: './world-card.html',
})
export class WorldCard {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
}
