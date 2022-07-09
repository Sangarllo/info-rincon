import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { AuthService } from '@auth/auth.service';
import { INotice } from '@models/notice';
import { IBase } from '@models/base';
import { IUser } from '@models/user';
import { CalendarEventsService } from '@services/calendar-events.service';
import { EventService } from '@services/events.service';
import { NoticeService } from '@services/notices.service';
import { StoriesService } from '@services/stories.service';
import { SeoService } from '@services/seo.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public userLogged: IUser;
  public alertedNotice: INotice;
  public theAlertedNotice$: Observable<INotice>;
  public nextStories$: Observable<IBase[]>;
  public fixedStories$: Observable<IBase[]>;
  public lastMemories$: Observable<IBase[]>;
  public favEvents$: Observable<IBase[]>;

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
    private eventSrv: EventService,
    private userSrv: UserService,
    public authSvc: AuthService,
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

    const subs1$ = this.authSvc.afAuth.user
    .subscribe( (user: any) => {
        if ( user?.uid ) {
          this.userSrv.getOneUser(user.uid)
              .subscribe( (userLogged: any ) => {
                  this.userLogged = userLogged;
                  console.log(`cargando favEvents: ${this.userLogged?.favEvents?.length}`);
                  this.favEvents$ = this.eventSrv.getSeveralEvent(this.userLogged.favEvents);
              });
        }
    });

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
