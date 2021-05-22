import { Component, Input } from '@angular/core';

import { IEvent } from '@models/event';

@Component({
  selector: 'app-event-basic-detail',
  templateUrl: './event-basic-detail.component.html',
  styleUrls: ['./event-basic-detail.component.scss']
})
export class EventBasicDetailComponent {

  @Input() event: IEvent;

  constructor() { }
}
