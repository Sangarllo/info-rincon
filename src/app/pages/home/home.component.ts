import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {MatAccordion} from '@angular/material/expansion';

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

import { CalendarEventsService } from '@services/calendar-events.service';
import { NoticeService } from '@services/notices.service';
import { INotice } from '@models/notice';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public alertedNotice: INotice;
  public theAlertedNotice$: Observable<INotice>;

  step = 0;
  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDateStr: string;
  locale = 'es';
  showHeader = true;

  calendarEvents$: Observable<CalendarEvent[]>;
  calendarEvents: CalendarEvent[];

  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private calEventsSrv: CalendarEventsService,
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
    this.calendarEvents$ = this.calEventsSrv.getCalendarEventsByRange(
      this.viewDate.toISOString().substr(0, 10),
      this.viewDate.toISOString().substr(0, 10));
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  openCalendarEventClicked(event: CalendarEvent): void {
    this.calEventsSrv.openCalendarEventClicked(event);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
