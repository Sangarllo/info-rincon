import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CalendarEvent } from 'angular-calendar';

import { LogService } from '@services/log.service';
import { EventService } from '@services/events.service';
import { IEvent } from '@models/event';

import { EventItemDialogComponent } from '@features/events/event-item-dialog/event-item-dialog.component';
import { IPlace } from '@models/place';
import { IBase } from '@models/base';

@Component({
  selector: 'app-calendar-event-items-panel',
  templateUrl: './calendar-event-items-panel.component.html',
  styleUrls: ['./calendar-event-items-panel.component.scss']
})
export class CalendarEventItemsPanelComponent implements OnInit {

  @Input() calendarEvents: CalendarEvent[];
  public onlyEvent: IEvent;
  public eventPlace: IPlace;

  private listOfObservers: Array<Subscription> = [];
  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private logSrv: LogService,
    private eventsSrv: EventService,
  ) { }

  ngOnInit(): void {
    if ( this.calendarEvents.length === 1 ) {
      const eventId = this.calendarEvents[0].id.toString();
      const subs1$ = this.eventsSrv.getOneEvent(eventId)
      .pipe(take(1))
      .subscribe((event: IEvent) => {
        this.onlyEvent = event;
        this.eventPlace = this.onlyEvent?.placeItems[0] ?? null;
      });

      this.listOfObservers.push(subs1$);
    }
  }

  openCalendarEventClicked(event: CalendarEvent): void {
    const idData = String(event.id).split('_');
    const eventId = idData[0];
    const scheduleId = idData.length > 1 ? String(event.id) : '';

    const subs2$ = this.eventsSrv.getOneEvent(eventId)
      .pipe(take(1))
      .subscribe((event: IEvent) => {
        this.openEventDialog(event, scheduleId);
      });

    this.listOfObservers.push(subs2$);
  }

  openEventClicked(event: IEvent): void {
    const idData = String(event.id).split('_');
    const eventId = idData[0];
    const scheduleId = idData.length > 1 ? String(event.id) : '';

    this.router.navigate([`eventos/${eventId}`]);
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
