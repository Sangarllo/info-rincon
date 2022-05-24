import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IEvent, Event } from '@models/event';
import { PictureService } from '@services/pictures.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() event: IEvent;

  constructor(
    private pictureSrv: PictureService,
    private spinnerSvc: SpinnerService,
    private router: Router,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;
    this.event.extra2 = ( this.event.categories ) ? this.event.categories.reduce(reducer, '') : '';

    this.spinnerSvc.hide();
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  gotoEvent(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.event.id}`]);
  }
}
