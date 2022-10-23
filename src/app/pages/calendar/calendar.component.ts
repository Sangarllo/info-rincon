import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
} from 'date-fns';

import { CalendarEventsService } from '@services/calendar-events.service';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
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
  entities = [];
  events$: Observable<CalendarEvent[]>;

  readonly NOW = new Date();
  readonly DATE_MIN = new Date(
      this.NOW.getFullYear()-1,
      this.NOW.getMonth(),
      this.NOW.getDay()).toISOString().substring(0, 10);
  readonly DATE_MAX = new Date(
      this.NOW.getFullYear()+1,
      this.NOW.getMonth(),
      this.NOW.getDay()).toISOString().substring(0, 10);

  constructor(
    private router: Router,
    private calEventsSrv: CalendarEventsService,
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
      this.events$ = this.calEventsSrv.getCalendarEventsByRange(
          this.DATE_MIN, this.DATE_MAX,
          ( this.entities.length === 0 ) ? null : this.entities
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
      // console.log(` -> eventClicked: ${event.id}`);
      this.router.navigate([`eventos/${event.id}`]);
  }

  filterEntities(entities: string[]): void {

      if (entities.length === 0) { // Cualquier entidad

            console.log(` -> cualquier entidad`);
            this.entityId = '0';
            this.entities = [];
            this.infoEventsFooter = ` en la agenda`;
      }
      else if ( entities.length === 1 ) { // Filtrar por una entidad

            const entityId = entities[0];
            // console.log(` -> select Entity 3`);
            // console.log(` -> select Entity: ${entityId}`);
            this.entityId = entityId;
            this.entities = [entityId];
            this.infoEventsFooter = ` vinculados a esta entidad`;
      } else {
        console.log(` -> varias entidades`);
        this.entityId = '0';
        this.entities = entities;
        this.infoEventsFooter = ` para estas ${entities.length} entidades`;
      }

      this.fetchEvents();
  }
}
