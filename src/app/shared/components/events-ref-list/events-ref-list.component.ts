/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { IEventRef } from '@models/event-ref';
import { Event } from '@models/event';
import { IUser } from '@models/user';

@Component({
  selector: 'sh-events-ref-list',
  templateUrl: './events-ref-list.component.html',
  styleUrls: ['./events-ref-list.component.scss']

})
export class EventsRefListComponent implements OnInit {

  @Input() eventsRef: IEventRef[];
  @Input() modeAdmin: boolean;
  @Input() userLogged: IUser;
  @Output() deleteRef = new EventEmitter<IEventRef>();

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.eventsRef.sort(
      function(a: IEventRef, b: IEventRef) {
        if ( a.dateStr < b.dateStr ) {
          return -1;
        } else if ( a.dateStr > b.dateStr ) {
          return 1;
        } else if ( a.timeStr < b.timeStr ) {
          return -1;
        } else if ( a.timeStr > b.timeStr ) {
          return 1;
        } else {
          return 0;
        }
    });
  }

  gotoEventRef(eventRef: IEventRef): void {
    if ( eventRef.eventId ) {
      this.router.navigate([`/${Event.PATH_URL}/${eventRef.eventId}`]);
    }
  }

  deleteEventRef(eventRef: IEventRef): void {
    this.deleteRef.emit(eventRef);
  }
}
