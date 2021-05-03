import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

import { EventService } from '@services/events.service';
import { NoticeService } from '@services/notices.service';
import { INotice } from '@models/notice';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  public alertedNotice: INotice;
  public theAlertedNotice$: Observable<INotice>;

  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDateStr: string;
  locale = 'es';
  showHeader = true;

  events$: Observable<CalendarEvent[]>;

  constructor(
    private router: Router,
    private eventsSrv: EventService,
    private noticesSrv: NoticeService,
  ) {

  }

  ngOnInit(): void {
    this.viewDate.setUTCHours(0, 0, 0, 0);
    this.viewDateStr = this.viewDate.toISOString().substr(0, 10);

    this.theAlertedNotice$ = this.noticesSrv
      .getTheAlertedNotice()
      .pipe(
        map( notices => { return notices[0] })
      );

    this.fetchEvents();
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    this.events$ = this.eventsSrv.getAllDayEventsAppointments(this.viewDateStr);
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

}
