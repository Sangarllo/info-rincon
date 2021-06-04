import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {MatAccordion} from '@angular/material/expansion';

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
import { EventItemDialogComponent } from '@features/events/event-item-dialog/event-item-dialog.component';
import { IPlace } from '@models/place';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;

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
    this.events$ = this.eventsSrv.getCalendarEventsByRange(
      this.viewDate.toISOString().substr(0, 10),
      this.viewDate.toISOString().substr(0, 10));
  }

  eventClicked(event: CalendarEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  openEventClicked(event: CalendarEvent): void {
    const idData = String(event.id).split('_');
    const eventId = idData[0];
    const scheduleId = idData.length > 1 ? String(event.id) : '';

    const subs1$ = this.eventsSrv.getOneEvent(eventId)
      .pipe(take(1))
      .subscribe((event: IEvent) => {
        this.openEventDialog(event, scheduleId);
      });

    this.listOfObservers.push(subs1$);
  }

  openEventDialog(event: IEvent, scheduleId: string): void {
    this.dialogConfig.width = '600px';
    let eventPlace: IPlace = event?.placeItems[0] ?? null;

    if ( scheduleId ) {

      event.extra = `${event.id}|${event.name}|${event.image}`;

      const schedule = event.scheduleItems.find( item => item.id === scheduleId );
      console.log(`schedule: ${JSON.stringify(schedule)}`);
      event.name = schedule.name;
      event.image = schedule.image;
      event.description = schedule.description;
      event.timestamp = schedule.extra;
      eventPlace = schedule.place ?? eventPlace;
    }

    const eventBase = event as IBase;
    eventBase.place = eventPlace;

    this.dialogConfig.data = eventBase;

    const dialogRef = this.dialog.open(
      EventItemDialogComponent,
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
