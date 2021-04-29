import { Component, Input } from '@angular/core';
import { IEvent } from 'src/app/core/models/event';

@Component({
  selector: 'app-event-image-detail',
  templateUrl: './event-image-detail.component.html'
})
export class EventImageDetailComponent {

  @Input() event: IEvent;

  constructor() { }
}
