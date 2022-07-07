import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { INotice } from '@models/notice';
import { IBase } from '@models/base';
import { CalendarEventsService } from '@services/calendar-events.service';
import { NoticeService } from '@services/notices.service';
import { StoriesService } from '@services/stories.service';
import { SeoService } from '@services/seo.service';

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
  public nextStories$: Observable<IBase[]>;
  public fixedStories$: Observable<IBase[]>;
  public lastMemories$: Observable<IBase[]>;

  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDateStr: string;
  locale = 'es';
  showHeader = true;

  constructor(
    private router: Router,
    private calEventsSrv: CalendarEventsService,
    private noticesSrv: NoticeService,
    private storiesSrv: StoriesService,
    private seo: SeoService,
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

    this.nextStories$ = this.storiesSrv.getNextStories();
    this.fixedStories$ = this.storiesSrv.getFixedStories();
    this.lastMemories$ = this.storiesSrv.getLastMemories();

    this.seo.generateTags({
      title: 'Agenda Rinconera | Rincón de Soto',
      description: 'WebApp de eventos e información general de Rincón de Soto, La Rioja',
      // eslint-disable-next-line max-len
      image: 'https://firebasestorage.googleapis.com/v0/b/info-rincon.appspot.com/o/logo-agenda-rinconera.png?alt=media&token=7f18efd0-8761-4776-a136-65f961601afe',
    });
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  openCalendarEventClicked(event: CalendarEvent): void {
    this.calEventsSrv.openCalendarEventClicked(event);
  }
}
