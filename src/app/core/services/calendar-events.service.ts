import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CalendarEvent } from 'angular-calendar';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { colors } from '@shared/utils/colors';
import { AppointmentsService } from '@services/appointments.service';
import { EventService } from '@services/events.service';
import { IEvent } from '@models/event';
import { IPlace } from '@models/place';
import { IBase, BaseType, Base } from '@models/base';
import { IAppointment } from '@models/appointment';
import { EventItemDialogComponent } from '@features/events/event-item-dialog/event-item-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventsService {

  private listOfObservers: Array<Subscription> = [];

  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private eventsSrv: EventService,
    private appointmentSrv: AppointmentsService,
  ) { }

  getCalendarEventsByRange(dateMinStr: string, dateMaxStr: string): Observable<CalendarEvent[]> {
    const events$ = this.eventsSrv.getAllEvents(true, false, null);
    const appointments$ = this.appointmentSrv.getAppointmentsByRange(
      dateMinStr, dateMaxStr
    );

    return combineLatest([
      appointments$,
      events$
    ])
      .pipe(
        tap(([appointments, events ]) => {
          console.log(`Nº appointments: ${appointments.length}`);
          console.log(`Nº events: ${events.length}`);
          appointments.forEach(item => console.warn(item.id));
        }),
        map(([appointments, events ]) => appointments

          .map(appointment =>
            this.getEventFromAppointment(appointment, events)
            )),
          // tap(data => console.log(`-> Hay ${data.length}`)),
          map(data => data.filter(e => e?.id)),
          // tap(data => console.log(`-> Hay ${data.length}`)),
    );
  }

  openCalendarEventClicked(calEvent: CalendarEvent): void {
    const idData = String(calEvent.id).split('_');
    const eventId = idData[0];
    const scheduleId = idData.length > 1 ? String(calEvent.id) : '';

    const subs1$ = this.eventsSrv.getOneEvent(eventId)
      .pipe(take(1))
      .subscribe((event: IEvent) => {
        this.openEventDialog(event, scheduleId);
      });

    this.listOfObservers.push(subs1$);
  }

  getBaseFromCalendarEvent(calEvent: CalendarEvent): Observable<IBase> {
    const idData = String(calEvent.id).split('_');
    const eventId = idData[0];
    const scheduleId = idData.length > 1 ? String(calEvent.id) : '';

    return this.eventsSrv.getOneEvent(eventId)
      .pipe(
        take(1),
        map(event => {
            return this.getBaseFromEvent(event, scheduleId)
          }
        )
      );
  }

  private getBaseFromEvent(event: IEvent, scheduleId: string): IBase {

    let eventPlace: IPlace = event?.placeItems[0] ?? null;

    if ( scheduleId ) {

      event.extra = `${event.id}|${event.name}|${event.image}`;

      const schedule = event.scheduleItems.find( item => item.id === scheduleId );
              // console.log(`schedule: ${JSON.stringify(schedule)}`);
      event.name = schedule.name;
      event.image = schedule.image;
      event.description = schedule.description;
      event.timestamp = schedule.extra;
      eventPlace = schedule.place ?? eventPlace;
    }

    const eventBase = event as IBase;
    eventBase.place = eventPlace;

    return eventBase;
  }


  private openEventDialog(event: IEvent, scheduleId: string): void {
    this.dialogConfig.width = '600px';
    this.dialogConfig.data = this.getBaseFromEvent(event, scheduleId);

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

  private isValidCalendarEvent(event: IEvent): boolean {
    return ( event?.active && event?.status === 'VISIBLE' );
  }

  private getEventFromAppointment(appointment: IAppointment, events: IEvent[]): CalendarEvent | null {
    const idData = appointment.id.split('_');
    const eventId = idData[0];
    const event = events.find(e => e.id === eventId);
    const isSchedule = idData.length > 1;
    const isValidEvent = this.isValidCalendarEvent(event);

    if ( isValidEvent ) {

      let scheduleItem: IBase;
      if ( isSchedule ) {
        scheduleItem = event.scheduleItems.find( item => item.id === appointment.id );
        //console.log(`scheduleItem: ${JSON.stringify(scheduleItem)}`);
      }

      const theCalendarEvent = ({
        id: appointment.id,
        title: isSchedule ? scheduleItem?.name : event?.name,
        color: colors.color1,
        allDay: appointment.allDay,
        image: isSchedule ? scheduleItem.image : event.image,
        start: new Date(`${appointment.dateIni}T${appointment.timeIni}`),
        end: isSchedule ?
          new Date(`${appointment.dateIni}T${appointment.timeIni}`) :
          null,
      }) as CalendarEvent;
      // console.log(`CalendarEvent: ${JSON.stringify(theCalendarEvent)}`);
      return theCalendarEvent;
    } else {
      return null;
    }
  }

}
