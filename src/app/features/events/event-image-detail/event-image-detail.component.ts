import { Component, Input } from '@angular/core';
import { IEvent } from '@models/event';

@Component({
  selector: 'app-event-image-detail',
  templateUrl: './event-image-detail.component.html',
  styleUrls: ['./event-image-detail.component.scss']
})
export class EventImageDetailComponent {

  @Input() event: IEvent;

  constructor() { }

  public viewImage(): void {
    window.open(this.event.image, '_blank');
  }
}
