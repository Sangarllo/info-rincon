import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, combineLatest, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CalendarEvent } from 'angular-calendar';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { environment } from '@environments/environment';
import { colors } from '@shared/utils/colors';
import { BaseType, IBase } from '@models/base';
import { CalendarEventExtended, IEvent } from '@models/event';
import { IUser } from '@models/user';
import { AuditItem, AuditType } from '@models/audit';
import { IEntity } from '@models/entity';
import { ScheduleType } from '@models/shedule-type.enum';
import { AppointmentsService } from '@services/appointments.service';
import { EventSocialService } from '@services/events-social.service';
import { Status } from '@models/status.enum';

const EVENTS_COLLECTION = 'eventos';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventCollection!: AngularFirestoreCollection<IEvent>;
  private eventDoc!: AngularFirestoreDocument<IEvent>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private eventSocialSrv: EventSocialService,
    private appointmentSrv: AppointmentsService
  ) {
    this.eventCollection = afs.collection(EVENTS_COLLECTION);
  }

  getAllEvents(showOnlyActive: boolean, modeDashboard: boolean, sizeDashboard?: number, entityId?: string): Observable<IEvent[]> {

    if ( modeDashboard ) {
      this.eventCollection = this.afs.collection<IEvent>(
        EVENTS_COLLECTION,
        ref => ref.where('focused', '==', true)
                  .where('active', '==', true)
                  .where('status', '==', 'VISIBLE')
                  .orderBy('timestamp', 'desc')
                  .limit(sizeDashboard)
      );
    } else {
      if ( showOnlyActive ) {

        const timestampLastYear = this.appointmentSrv.getTimestamp(-1);
        console.log('timestampLastYear', timestampLastYear);

        if ( !entityId ) {
          // console.log(`-> No Hay entityId`);
          this.eventCollection = this.afs.collection<IEvent>(
            EVENTS_COLLECTION,
            ref => ref.where('active', '==', true)
                      .where('status', '==', 'VISIBLE')
                      .where('timestamp', '>', timestampLastYear)
                      .orderBy('timestamp', 'desc')
          );
        } else {
          // console.log(`-> Hay entityId ${entityId}`);
          this.eventCollection = this.afs.collection<IEvent>(
            EVENTS_COLLECTION,
            ref => ref.where('active', '==', true)
                      .where('status', '==', 'VISIBLE')
                      .where('timestamp', '>', timestampLastYear)
                      .where('entitiesArray', 'array-contains', entityId)
                      .orderBy('timestamp', 'desc')
          );
        }
      } else {
        this.eventCollection = this.afs.collection<IEvent>(
          EVENTS_COLLECTION,
          ref => ref.orderBy('timestamp', 'desc')
        );
      }
    }

    return this.eventCollection.valueChanges();
  }

  getAllEventsByUser(userUid: string): Observable<IEvent[]> {

    this.eventCollection = this.afs.collection<IEvent>(
        EVENTS_COLLECTION,
        ref => ref.where('userId', '==', userUid)
                  .orderBy('timestamp', 'desc')
    );

    return this.eventCollection.valueChanges();
  }

  getAllEventsByImage(imageId: string): Observable<IEvent[]> {
      this.eventCollection = this.afs.collection<IEvent>(
          EVENTS_COLLECTION,
          ref => ref.where('images', 'array-contains', imageId)
                    .orderBy('timestamp', 'desc')
      );

      return this.eventCollection.valueChanges();
  }

  getAllEventsWithAppointments(showOnlyActive: boolean,  addSocialInfo: boolean): Observable<IEvent[]> {
    const events$ = this.getAllEvents(showOnlyActive, false, null, null);
    const appointments$ = this.appointmentSrv.getAllAppointments();
    const eventsSocial$ = ( addSocialInfo ) ? this.eventSocialSrv.getAllEventsSocial() : of([]);

    return combineLatest([
      events$,
      appointments$,
      eventsSocial$
    ])
      .pipe(
        map(([events, appointments, eventsSocial]) => events.map(event => ({
          ...event,
          timestamp: formatDistance(new Date(event.timestamp), new Date(), {locale: es}),
          dateIni: appointments.find( a => a.id === event.id )?.dateIni,
          extra: ( addSocialInfo ) ?
              // eslint-disable-next-line max-len
              `${eventsSocial.find( e => e.id === event.id )?.nClaps}|${eventsSocial.find( e => e.id === event.id )?.usersFavs?.length}` : '0|0'
        }) as IEvent)),
    );
  }

  // TODO: is it senseless to get start time (for month view)
  getAllCalendarEventsAppointments(): Observable<CalendarEvent[]> {
    const events$ = this.getAllEvents(true, false, null, null);
    const appointments$ = this.appointmentSrv.getAllAppointments();

    return combineLatest([
      events$,
      appointments$
    ])
      .pipe(
        map(([events, appointments]) => events.map(event => ({
          id: event.id,
          title: event.name,
          color: colors.indigo,
          allDay: appointments.find(a => a.id === event.id)?.allDay,
          start: new Date(appointments.find(a => a.id === event.id)?.timeIni)
        }) as CalendarEvent)),
        // tap(data => this.logSrv.info('event:  ', JSON.stringify(data))),
    );
  }




  getAllEventsBase(): Observable<IBase[]> {
    this.eventCollection = this.afs.collection<IEvent>(
      EVENTS_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.eventCollection.valueChanges().pipe(
      map(events => events.map(event => {
        if ( event.active ) {
          return {
            id: event.id,
            active: event.active,
            name: event.name,
            image: event.image,
            baseType: BaseType.EVENT,
            description: event.description
          };
        }
      }))
    );
  }

  getOneEvent(idEvent: string): Observable<IEvent | undefined> {
    return this.eventCollection.doc(idEvent).valueChanges({ idField: 'id' });
  }

  getEventByUrl(sanitizedUrl: string): Observable<IEvent[]> {

    this.eventCollection = this.afs.collection<IEvent>(
      EVENTS_COLLECTION,
      ref => ref.where('sanitizedUrl', '==', sanitizedUrl)
                .where('active', '==', true)
                .where('status', '==', 'VISIBLE')
    );

    return this.eventCollection.valueChanges()
      .pipe(
        first()
      );//.subscribe(console.log, err => console.log('Error', err));
  }

  getSeveralEvent(events: string[]): Observable<IEvent[]>{

    const eventsObs: Observable<IEvent>[] = [];
    events.forEach(eventId => {
      eventsObs.push(this.getOneEvent(eventId));
    });

    return combineLatest(eventsObs);
  }


  async addEvent(event: IEvent): Promise<any> {

    const currentUser = await this.afAuth.currentUser;

    const eventId: string = this.afs.createId();
    const timestamp = this.appointmentSrv.getTimestamp();
    const auditItem = AuditItem.InitDefault(AuditType.CREATED, currentUser, timestamp);
    this.appointmentSrv.addAppointment(eventId);

    return this.eventCollection.doc(eventId).set({
      ...event,
      id: eventId,
      appointmentId: eventId,
      timestamp,
      auditItems: (environment.setAudit) ? [{...auditItem}] : [],
      userId: currentUser.uid,
      extra: '',
      extra2: '',
    });
  }

  async addEventFromEntity(event: IEvent, entity: IEntity, role: string): Promise<string> {

    const currentUser = await this.afAuth.currentUser;
    const timestamp = this.appointmentSrv.getTimestamp();

    if ( environment.setAudit ) {
      const auditItem = AuditItem.InitDefault(AuditType.CREATED, currentUser, timestamp);
      event.auditItems.push({...auditItem});
    }

    const eventId: string = this.afs.createId();
    const newEntityItem: IBase = {
      id: entity.id,
      active: true,
      name: entity.name,
      image: entity.image,
      baseType: BaseType.ENTITY,
      description: role,
    };

    event.images = [];
    const newImage = entity.image;
    if ( newImage ) {
      event.image = newImage;
      event.images.push(newImage);
    }

    this.appointmentSrv.addAppointment(eventId);

    const place = entity.place;
    const newPlaceItem: IBase = place ? {
        id: place.id,
        active: true,
        name: place.name,
        image: place.image,
        baseType: BaseType.PLACE,
        description: place.roleDefault ?? '',
      } : null;

    if ( place ) {
      event.images.push(place.image);
    }

    const categories = entity.categories;
    const scheduleType = entity.scheduleTypeDefault ?? ScheduleType.Acto;

    this.eventCollection.doc(eventId).set({
        ...event,
        id: eventId,
        appointmentId: eventId,
        timestamp,
        name: `Nuevo evento de ${entity.name}`,
        categories,
        scheduleType,
        placeItems: [ newPlaceItem ],
        entityItems: [ newEntityItem ],
        entitiesArray: [ entity.id ],
        extra: '',
        extra2: '',
      }
    );

    return Promise.resolve(eventId);
  }

  async updateEvent(event: IEvent, auditType: AuditType, descExtra?: string): Promise<void> {

    const currentUser = await this.afAuth.currentUser;

    const timeStamp = this.appointmentSrv.getTimestamp();
    event.timestamp = timeStamp;

    if ( environment.setAudit ) {
      const auditItem = AuditItem.InitDefault(auditType, currentUser, timeStamp, descExtra);
      event.auditItems.push({...auditItem});
    }

    const idEvent = event.id;
    this.eventDoc = this.afs.doc<IEvent>(`${EVENTS_COLLECTION}/${idEvent}`);

    return this.eventDoc.set(event, { merge: true });
  }

  deleteEvent(event: IEvent, currentUser: IUser): void {

    const timeStamp = this.appointmentSrv.getTimestamp();
    event.timestamp = timeStamp;

    if ( environment.setAudit ) {
      const auditItem = AuditItem.InitDefault(AuditType.DELETED, currentUser, timeStamp);
      event.auditItems.push({...auditItem});
    }

    const idEvent = event.id;
    event.active = false;
    event.status = Status.Deleted;
    this.eventDoc = this.afs.doc<IEvent>(`${EVENTS_COLLECTION}/${idEvent}`);
    this.eventDoc.update(event);
  }
}
