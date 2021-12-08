import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';


import { Observable } from 'rxjs';

import { IEventComment } from '@models/event-comment';
import { AppointmentsService } from '@services/appointments.service';

const EVENTS_COMMENTS_COLLECTION = 'eventos-comentarios';

@Injectable({
  providedIn: 'root'
})
export class EventsCommentsService {

  private eventCommentsCollection!: AngularFirestoreCollection<IEventComment>;
  private eventCommentsDoc!: AngularFirestoreDocument<IEventComment>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService,
  ) {
    this.eventCommentsCollection = afs.collection(EVENTS_COMMENTS_COLLECTION);
  }

  public getAllEventComments(eventId: string): Observable<IEventComment[]> {

    this.eventCommentsCollection = this.afs.collection<IEventComment>(
      EVENTS_COMMENTS_COLLECTION,
      ref => ref.where('eventId', '==', eventId)
                .orderBy('timestamp', 'desc')
    );

    return this.eventCommentsCollection.valueChanges();
  }

  async addEventComment(eventId: string, text: string): Promise<any> {

    const currentUser = await this.afAuth.currentUser;
    const id: string = this.afs.createId();
    const timestamp = this.appointmentSrv.getTimestamp();

    this.eventCommentsCollection.doc(id).set({
      id,
      eventId,
      timestamp,
      userId: currentUser.uid,
      text
    });
  }

  deleteEventComment(id: string): void {
    this.eventCommentsDoc = this.afs.doc<IEventComment>(`${EVENTS_COMMENTS_COLLECTION}/${id}`);
    this.eventCommentsDoc.delete();
  }
}
