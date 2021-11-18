import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { CalendarEventsService } from '@services/calendar-events.service';
import { IBase } from '@models/base';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() showSectionHeader = true;
  @Input() showHeader = true;
  @Input() showFooter = true;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  locale = 'es';
  weekStartsOn = 1;
  activeDayIsOpen = false;
  infoEventsFooter = ' en toda la agenda';
  entityId = '0';

  events$: Observable<CalendarEvent[]>;

  constructor(
    private router: Router,
    private calEventsSrv: CalendarEventsService
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
      console.log(`fetchEvents EntityId: ${this.entityId}`);
      this.events$ = this.calEventsSrv.getCalendarEventsByRange(
          '','',
          ( this.entityId === '0' ) ? null : this.entityId
      );
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

    eventClicked(event: CalendarEvent): void {
      this.router.navigate([`eventos/${event.id}`]);
    }


    selectEntity(entityBase: IBase): void {
      console.log(`select Entity: ${JSON.stringify(entityBase)}`);
      this.entityId = entityBase.id;
      console.log(`select EntityId: ${this.entityId}`);
      this.infoEventsFooter = ( entityBase.id === '0' ) ?
        ` en la agenda` :
        ` vinculados a ${entityBase.name}`;
      }
}
