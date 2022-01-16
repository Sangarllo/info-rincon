import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

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
import { StoriesService } from '@services/stories.service';
import { INotice } from '@models/notice';
import { IBase } from '@models/base';
import { SeoService } from '@services/seo.service';

import {
  Title,
  Meta,
  MetaDefinition
} from '@angular/platform-browser';

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
  public stories$: Observable<IBase[]>;

  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDateStr: string;
  locale = 'es';
  showHeader = true;

  // calendarEvents$: Observable<CalendarEvent[]>;

  constructor(
    private router: Router,
    private calEventsSrv: CalendarEventsService,
    private noticesSrv: NoticeService,
    private storiesSrv: StoriesService,
    private seoSrv: SeoService
    ) {
    }

  ngOnInit(): void {
    this.viewDate.setUTCHours(0, 0, 0, 0);
    this.viewDateStr = this.viewDate.toISOString().substr(0, 10);

    this.theAlertedNotice$ = this.noticesSrv
      .getTheAlertedNotice()
      .pipe(
        map( notices => notices[0] )
      );

    this.stories$ = this.storiesSrv.getStories();
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  openCalendarEventClicked(event: CalendarEvent): void {
    this.calEventsSrv.openCalendarEventClicked(event);
  }

}
