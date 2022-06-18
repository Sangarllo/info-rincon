import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EventService } from '@services/events.service';
import { AppointmentsService } from '@services/appointments.service';
import { IBase, BaseType } from '@models/base';
import { IAppointment } from '@models/appointment';
import { IEvent } from '@models/event';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  public stories$: Observable<IEvent[]>;
  private readonly N_DAYS_AHEAD = environment.storiesNDaysAhead;

  constructor(
    private eventSrv: EventService,
    private appointmentSrv: AppointmentsService,
  ) { }

  getStories(): Observable<IBase[]> {

    const dateToday = new Date();
    const dateTodayStr = dateToday.toISOString().substr(0, 10);

    const dateMax = new Date();
    dateMax.setDate(dateMax.getDate() + this.N_DAYS_AHEAD);
    const dateMaxStr = dateMax.toISOString().substr(0, 10);

    // console.log(`dateTodayStr: ${dateTodayStr}`);
    // console.log(`dateMaxStr: ${dateMaxStr}`);

    const appointments$ = this.appointmentSrv.getAppointmentsByRange(dateTodayStr, dateMaxStr, false);
    const events$ = this.eventSrv.getAllEvents(true, true);

    return combineLatest([
      appointments$,
      events$
    ])
      .pipe(
        // tap(([appointments, events ]) => {
        //   console.log(`Nº appointments: ${appointments.length}`);
        //   console.log(`Nº events: ${events.length}`);
        // }),
        map(([appointments, events ]) =>
            appointments.map(appointment =>
              this.getEventBaseFromAppointment(appointment, events)
            )),
        map(data => data.filter(e => e?.id)),
    );
  }

  private getEventBaseFromAppointment(appointment: IAppointment, events: IEvent[]): IBase | null {
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

      const theEventBase = ({
        id: appointment.id,
        name: isSchedule ? scheduleItem?.name : event?.name,
        baseType: BaseType.EVENT,
        imageId:  isSchedule ? scheduleItem?.imageId : event?.imageId,
        imagePath:  isSchedule ? scheduleItem?.imagePath : event?.imagePath,
      }) as IBase;
      // console.log(`CalendarEvent: ${JSON.stringify(theEventBase)}`);
      return theEventBase;
    } else {
      return null;
    }
  }

  private isValidCalendarEvent(event: IEvent): boolean {
    return ( event?.active && event?.status === 'VISIBLE' );
  }

}
