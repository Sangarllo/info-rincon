import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


import { Observable } from 'rxjs';

import { IEventComment, INoticeComment } from '@models/comment';
import { AppointmentsService } from '@services/appointments.service';

const EVENTS_COMMENTS_COLLECTION = 'eventos-comentarios';
const NOTICES_COMMENTS_COLLECTION = 'avisos-comentarios';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private eventCommentsCollection!: AngularFirestoreCollection<IEventComment>;
  private eventCommentsDoc!: AngularFirestoreDocument<IEventComment>;
  private noticeCommentsCollection!: AngularFirestoreCollection<INoticeComment>;
  private noticeCommentsDoc!: AngularFirestoreDocument<INoticeComment>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService,
  ) {
    this.eventCommentsCollection = afs.collection(EVENTS_COMMENTS_COLLECTION);
    this.noticeCommentsCollection = afs.collection(NOTICES_COMMENTS_COLLECTION);
  }

  public getAllEventComments(eventId: string): Observable<IEventComment[]> {

    this.eventCommentsCollection = this.afs.collection<IEventComment>(
      EVENTS_COMMENTS_COLLECTION,
      ref => ref.where('eventId', '==', eventId)
                .orderBy('timestamp', 'desc')
    );

    return this.eventCommentsCollection.valueChanges();
  }

  public getAllNoticeComments(noticeId: string): Observable<INoticeComment[]> {

    this.noticeCommentsCollection = this.afs.collection<INoticeComment>(
      NOTICES_COMMENTS_COLLECTION,
      ref => ref.where('noticeId', '==', noticeId)
                .orderBy('timestamp', 'desc')
    );

    return this.noticeCommentsCollection.valueChanges();
  }

  async addEventComment(eventId: string, message: string): Promise<any> {

    const currentUser = await this.afAuth.currentUser;
    const id: string = this.afs.createId();
    const timestamp = this.appointmentSrv.getTimestamp();

    this.eventCommentsCollection.doc(id).set({
      id,
      eventId,
      timestamp,
      userUid: currentUser.uid,
      userName: currentUser.displayName,
      userImage: currentUser.photoURL,
      message,
    });
  }

  async addNoticeComment(noticeId: string, message: string): Promise<any> {

    const currentUser = await this.afAuth.currentUser;
    const id: string = this.afs.createId();
    const timestamp = this.appointmentSrv.getTimestamp();

    this.noticeCommentsCollection.doc(id).set({
      id,
      noticeId,
      timestamp,
      userUid: currentUser.uid,
      userName: currentUser.displayName,
      userImage: currentUser.photoURL,
      message,
    });
  }

  deleteEventComment(id: string): void {
    this.eventCommentsDoc = this.afs.doc<IEventComment>(`${EVENTS_COMMENTS_COLLECTION}/${id}`);
    this.eventCommentsDoc.delete();
  }

  deleteNoticeComment(id: string): void {
    this.noticeCommentsDoc = this.afs.doc<INoticeComment>(`${NOTICES_COMMENTS_COLLECTION}/${id}`);
    this.noticeCommentsDoc.delete();
  }
}
