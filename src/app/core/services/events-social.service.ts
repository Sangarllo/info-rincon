import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { IEventSocial } from '@models/event-social';

const EVENTS_SOCIAL_COLLECTION = 'eventos-social';

@Injectable({
  providedIn: 'root'
})
export class EventSocialService {

  private eventSocialCollection!: AngularFirestoreCollection<IEventSocial>;
  private eventSocialDoc!: AngularFirestoreDocument<IEventSocial>;

  constructor(
    private afs: AngularFirestore,
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

  public async addFavourite(eventSocial: IEventSocial, userUid: string): Promise<void> {
    const eventSocialId = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${eventSocialId}`);
    if ( eventSocial.usersFavs ) {
      eventSocial.usersFavs = eventSocial.usersFavs.filter( userId => userId !== userUid );
      eventSocial.usersFavs.push(userUid);
    } else {
      eventSocial.usersFavs = [ userUid ];
    }
    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }

  public async removeFavourite(eventSocial: IEventSocial, userUid: string): Promise<void> {
    const eventSocialId = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${eventSocialId}`);
    eventSocial.usersFavs = eventSocial.usersFavs.filter( userId => userId !== userUid );
    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }

  public async addClaps(eventSocial: IEventSocial): Promise<void> {
    const idEvent = eventSocial.id;
    this.eventSocialDoc = this.afs.doc<IEventSocial>(`${EVENTS_SOCIAL_COLLECTION}/${idEvent}`);
    eventSocial.nClaps = ( eventSocial.nClaps ) ? eventSocial.nClaps+1 : 1;
    return this.eventSocialDoc.set(eventSocial, { merge: true });
  }
}
