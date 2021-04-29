import { Component, Input } from '@angular/core';
import { IEvent } from 'src/app/core/models/event';

@Component({
  selector: 'app-event-status-detail',
  templateUrl: './event-status-detail.component.html'
})
export class EventStatusDetailComponent {

  @Input() event: IEvent;

  constructor() { }
}
