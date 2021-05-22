import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
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
import { CalendarEventExtended, IEvent } from '@models/event';
import { Base, IBase, BaseType } from '@models/base';
import { BaseItemDialogComponent } from '@shared/components/base-item-dialog/base-item-dialog.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
  public alertedNotice: INotice;
  public theAlertedNotice$: Observable<INotice>;

  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDateStr: string;
  locale = 'es';
  showHeader = true;

  events$: Observable<CalendarEvent[]>;
  events: CalendarEvent[];
  eventsExtended: CalendarEventExtended[];

  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
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

    this.events$ = this.eventsSrv.getCalendarEventsByRange(
      this.viewDate.toISOString().substr(0, 10),
      this.viewDate.toISOString().substr(0, 10));
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  openEventClicked(event: CalendarEvent): void {
    const subs1$ = this.eventsSrv.getOneEvent('' + event.id)
      .pipe(take(1))
      .subscribe((event: IEvent) => {
        this.openEventDialog(event);
      });

    this.listOfObservers.push(subs1$);
  }

  openEventDialog(event: IEvent): void {
    this.dialogConfig.width = '600px';
    this.dialogConfig.data = event as IBase;
    const dialogRef = this.dialog.open(
      BaseItemDialogComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe((baseDialog: IBase) => {
      if ( baseDialog ) {
        console.log('Cerrado dialog');
      }
    });

  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
