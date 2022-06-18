import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { IEventSocial } from '@models/event-social';
import { AuditSocialType } from '@models/audit-social';
import { BaseType } from '@models/base';
import { AuditSocialService } from '@services/audit-social.service';

const EVENTS_SOCIAL_COLLECTION = 'eventos-social';

@Injectable({
  providedIn: 'root'
})
export class EventSocialService {

  private eventSocialCollection!: AngularFirestoreCollection<IEventSocial>;
  private eventSocialDoc!: AngularFirestoreDocument<IEventSocial>;

  constructor(
    private afs: AngularFirestore,
    private auditSocialSrv: AuditSocialService,
  ) {
    this.eventSocialCollection = afs.collection(EVENTS_SOCIAL_COLLECTION);
  }

  public getAllEventsSocial(): Observable<IEventSocial[]> {
    this.eventSocialCollection = this.afs.collection<IEventSocial>(
      EVENTS_SOCIAL_COLLECTION
    );
    return this.eventSocialCollection.valueChanges();
  }

  public getEventSocial(eventSocialId: string): Observable<IEventSocial> {
    return this.eventSocialCollection.doc(eventSocialId).valueChanges({ idField: 'id' });
  }

  addEventSocial(eventSocialId: string): void {
    this.eventSocialCollection.doc(eventSocialId).set({
      id: eventSocialId,
      usersFavs: [],
      nClaps: 0,
    });
  }

  public async updateEvent(eventSocial: IEventSocial): Promise<void> {

    const eventSocialId = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${eventSocialId}`);

    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }

  public async addFavourite(eventSocial: IEventSocial, eventName: string, userUid: string, userName: string): Promise<void> {

    const eventSocialId = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${eventSocialId}`);
    if ( eventSocial.usersFavs ) {
      eventSocial.usersFavs = eventSocial.usersFavs.filter( userId => userId !== userUid );
      eventSocial.usersFavs.push(userUid);
    } else {
      eventSocial.usersFavs = [ userUid ];
    }

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.FAV_ON,
      eventSocialId, eventName, BaseType.EVENT,
      userUid, userName,
      ''
    );

    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }

  public async removeFavourite(eventSocial: IEventSocial, eventName: string, userUid: string, userName: string): Promise<void> {

    const eventSocialId = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${eventSocialId}`);
    eventSocial.usersFavs = eventSocial.usersFavs.filter( userId => userId !== userUid );

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.FAV_OFF,
      eventSocialId, eventName, BaseType.EVENT,
      userUid, userName,
      ''
    );

    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }

  public async addClaps(eventSocial: IEventSocial, eventName: string): Promise<void> {
    const idEvent = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${idEvent}`);
    eventSocial.nClaps = ( eventSocial.nClaps ) ? eventSocial.nClaps+1 : 1;

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.CLAP,
      idEvent, eventName, BaseType.EVENT,
      '',
      ''
    );

    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }
}
