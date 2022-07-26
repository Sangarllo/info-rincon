import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable, combineLatest, of, firstValueFrom } from 'rxjs';
import { first, map, tap, take } from 'rxjs/operators';
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
import { ITags } from '@models/tags';
import { ScheduleType } from '@models/shedule-type.enum';
import { Status } from '@models/status.enum';
import { AppointmentsService } from '@services/appointments.service';
import { ItemSocialService } from '@services/items-social.service';
import { PictureService } from '@services/pictures.service';
import { UserRole } from '@models/user-role.enum';
import { Place } from '@models/place';
import { IAppointment } from '@models/appointment';

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
    private itemSocialSrv: ItemSocialService,
    private appointmentSrv: AppointmentsService,
    private pictureSrv: PictureService,
  ) {
    this.eventCollection = afs.collection(EVENTS_COLLECTION);
  }

  getAllEvents(
      showOnlyActive: boolean,
      modeDashboard: boolean,
      fixedEvents: boolean,
      sizeDashboard?: number,
      entities?: string[]):
  Observable<IEvent[]> {

    if ( modeDashboard ) {
      if ( fixedEvents ) {
        this.eventCollection = this.afs.collection<IEvent>(
          EVENTS_COLLECTION,
          ref => ref.where('focused', '==', true)
                    .where('fixed', '==', true)
                    .where('active', '==', true)
                    .where('status', '==', 'VISIBLE')
                    .orderBy('timestamp', 'desc')
                    .limit(sizeDashboard)
        );
      } else {
        this.eventCollection = this.afs.collection<IEvent>(
          EVENTS_COLLECTION,
          ref => ref.where('focused', '==', true)
                    .where('active', '==', true)
                    .where('status', '==', 'VISIBLE')
                    .orderBy('timestamp', 'desc')
                    .limit(sizeDashboard)
        );
      }
    } else {
      if ( showOnlyActive ) {

        const timestampLastYear = this.appointmentSrv.getTimestamp(-1);
        // console.log('timestampLastYear', timestampLastYear);

        if ( !entities ) {
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
                      .where('entitiesArray', 'array-contains-any', entities)
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

  getAllEventsByAuthUser(userId: string): Observable<IEvent[]> {
      this.eventCollection = this.afs.collection<IEvent>(
        EVENTS_COLLECTION,
        ref => ref.where('usersArray', 'array-contains', userId)
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

  getAllEventsWithAppointments(showOnlyActive: boolean,  addSocialInfo: boolean, userUid?: string): Observable<IEvent[]> {
    const events$ = ( userUid ) ?
        this.getAllEventsByAuthUser(userUid) :
        this.getAllEvents(showOnlyActive, false, false, null, null);
    const appointments$ = this.appointmentSrv.getAllAppointments();
    const eventsSocial$ = ( addSocialInfo ) ? this.itemSocialSrv.getAllItemsSocial() : of([]);
    const pictures$ = this.pictureSrv.getAllPictures();

    return combineLatest([
      events$,
      appointments$,
      eventsSocial$,
      pictures$
    ])
      .pipe(
        map(([events, appointments, eventsSocial, pictures]) => events.map(event => ({
          ...event,
          timestamp: formatDistance(new Date(event.timestamp), new Date(), {locale: es}),
          dateIni: appointments.find( a => a.id === event.id )?.dateIni,
          imageId: pictures.find( p => p.id === event.imageId )?.id ?? event.imageId,
          imagePath: (pictures.find( p => p.path === event.imagePath )?.path) ?? event.imagePath,
          auditItems: ( environment.setAudit ) ? event.auditItems : [],
          extra: ( addSocialInfo ) ?
              // eslint-disable-next-line max-len
              `${eventsSocial.find( e => e.id === event.id )?.nClaps}|${eventsSocial.find( e => e.id === event.id )?.usersFavs?.length}` : '0|0'
        }) as IEvent)),
        // tap(datas => datas.forEach(data => console.log(` -> event: ${data.id} | ${data.name} | ${data.image}`))),
    );
  }

  // TODO: is it senseless to get start time (for month view)
  getAllCalendarEventsAppointments(): Observable<CalendarEvent[]> {
    const events$ = this.getAllEvents(true, false, false, null, null);
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
        // tap(data => console.log('event:  ', JSON.stringify(data))),
    );
  }

  getAllEventsByEntity(entityId: string): Observable<IEvent[]> {

    this.eventCollection = this.afs.collection<IEvent>(
        EVENTS_COLLECTION,
        ref => ref.where('entitiesArray', 'array-contains', entityId)
                  .orderBy('timestamp', 'desc')
    );

    return this.eventCollection.valueChanges();
  }

  getEventsByEntityAndRange(dateMinStr: string, dateMaxStr: string, entityId: string): Observable<IEvent[]> {
    const events$ = this.getAllEvents(true, false, false, null, [entityId]);
    const appointments$ = this.appointmentSrv.getAppointmentsByRange(dateMinStr, dateMaxStr, true);

    return combineLatest([
      appointments$,
      events$
    ])
      .pipe(
        // tap(([appointments, events ]) => {
        //   console.log(`Nº appointments: ${appointments.length}`);
        //   console.log(`Nº events: ${events.length}`);
        //   appointments.forEach(item => console.warn(item.id));
        // }),
        map(([appointments, events ]) => appointments

          .map(appointment =>
            this.getIEventFromAppointment(appointment, events, entityId)
            )),
        // tap(data => console.log(`-> Hay ${data.length}`)),
        map(data => data.filter(e => e?.id)),
        // tap(data => console.log(`-> Hay ${data.length}`)),
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
            imageId: event.imageId,
            imagePath: event.imagePath,
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

  getOneSubEvent(idEvent: string): Observable<IEvent | undefined> {
    return this.eventCollection.doc(idEvent).valueChanges({ idField: 'id' });
  }

  async getOneEventAsync(idEvent: string): Promise<IEvent | undefined> {
    const firstValue = await firstValueFrom(
        this.eventCollection.doc(idEvent).valueChanges()
    );
    return firstValue;
  }

  getImageFromEvent(idEvent: string): Observable<string> {
    return this.eventCollection.doc(idEvent).valueChanges()
      .pipe(
        take(1),
        map(event => event.imagePath)
      );
  }

  getTagsFromEvent(idEvent: string): Observable<ITags> {
    return this.eventCollection.doc(idEvent).valueChanges()
      .pipe(
        take(1),
        map(event => ({
          name: event.name,
          description: event.description,
          image: event.imagePath,
        } as ITags)
      )
    );
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
      );
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
      usersArray: [currentUser.uid],
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
      imageId: entity.imageId,
      imagePath: entity.imagePath,
      baseType: BaseType.ENTITY,
      description: role,
    };

    event.images = [];
    const newImage = entity.imageId;
    if ( newImage ) {
      event.imageId = entity.imageId;
      event.imagePath = entity.imagePath;
      event.images.push(newImage);
    }

    this.appointmentSrv.addAppointment(eventId);

    const place = entity.place;
    if ( place ) {
      console.log(`hay place: ${place.imageId}`);
      console.log(`hay place: ${place.imagePath}`);
    } else {
      console.log(`no hay place`);
    }

    const newPlaceItem: IBase = place ? {
        id: place.id,
        active: true,
        name: place.name,
        imageId: place.imageId ?? Place.IMAGE_DEFAULT,
        imagePath: place.imagePath ?? Place.IMAGE_DEFAULT,
        baseType: BaseType.PLACE,
        description: place.roleDefault ?? '',
      } : null;

    console.log(`JSON.stringify(newPlaceItem): ${JSON.stringify(newPlaceItem)}`);


    if ( place ) {
      event.images.push(place.imageId ?? Place.IMAGE_DEFAULT);
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
        placeItems: newPlaceItem ? [newPlaceItem] : [],
        entityItems: [newEntityItem],
        entitiesArray: [ entity.id ],
        userId: currentUser.uid,
        usersArray: [currentUser.uid],
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

    if ( !event.usersArray.includes(currentUser.uid) ) {
      event.usersArray.push(currentUser.uid);
    }

    const idEvent = event.id;
    this.eventDoc = this.afs.doc<IEvent>(`${EVENTS_COLLECTION}/${idEvent}`);

    return this.eventDoc.set(event, { merge: true });
  }

  async deleteEvent(event: IEvent): Promise<void> {

    const currentUser = await this.afAuth.currentUser;
    const timeStamp = this.appointmentSrv.getTimestamp();
    event.timestamp = timeStamp;

    if ( environment.setAudit ) {
      const auditItem = AuditItem.InitDefault(AuditType.DELETED, currentUser, timeStamp);
      event.auditItems.push({...auditItem});
    }

    if ( !event.usersArray.includes(currentUser.uid) ) {
      event.usersArray.push(currentUser.uid);
    }

    const idEvent = event.id;
    event.active = false;
    event.status = Status.Deleted;
    this.eventDoc = this.afs.doc<IEvent>(`${EVENTS_COLLECTION}/${idEvent}`);
    this.eventDoc.update(event);
  }

  deleteForeverEvent(event: IEvent): void {

    this.eventDoc = this.afs.doc<IEvent>(`${EVENTS_COLLECTION}/${event.id}`);

    // 2. Delete appointments
    event.scheduleItems.forEach(scheduleItem => {
      this.appointmentSrv.deleteAppointment(scheduleItem.id);
    });
    this.appointmentSrv.deleteAppointment(event.id);

    // 3. Social
    // TODO: Delete social

    this.eventDoc.delete();

    // 4 -> Audit deletion
  }

  private isValidCalendarEvent(event: IEvent): boolean {
    return ( event?.active && event?.status === 'VISIBLE' );
  }

  private getIEventFromAppointment(appointment: IAppointment, events: IEvent[], entityId: string): IEvent | null {
    const idData = appointment.id.split('_');
    const eventId = idData[0];
    const event = events.find(e => e.id === eventId);
    const isValidEvent = this.isValidCalendarEvent(event);

    if ( isValidEvent ) {

      // const dateIni = new Date(`${appointment.dateIni}T${appointment.timeIni}`);
      // const dateEnd = new Date(`${appointment.dateEnd}T${appointment.timeEnd}`);
      // event.extra = `${dateIni} | ${dateEnd}`;

      event.extra = `${appointment.dateIni} ${appointment.timeIni}`;

      const entityRol = event.entityItems.find( item => item.id === entityId);
      event.extra2 = entityRol ? entityRol.description : '-';

      // console.log(`CalendarEvent (${isSchedule}): ${JSON.stringify(theCalendarEvent)}`);
      return event;
    } else {
      return null;
    }
  }

}
