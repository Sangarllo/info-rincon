import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


import { Observable } from 'rxjs';

import { CommentType, IComment } from '@models/comment';
import { AppointmentsService } from '@services/appointments.service';
import { AuditSocialService } from '@services/audit-social.service';
import { AuditSocialType } from '@models/audit-social';
import { BaseType } from '@models/base';

const COMMENTS_COLLECTION = 'comentarios';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private commentsCollection!: AngularFirestoreCollection<IComment>;
  private commentsDoc!: AngularFirestoreDocument<IComment>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService,
    private auditSocialSrv: AuditSocialService,
  ) {
    this.commentsCollection = afs.collection(COMMENTS_COLLECTION);
  }

  public getAllComments(eventId: string): Observable<IComment[]> {

    this.commentsCollection = this.afs.collection<IComment>(
      COMMENTS_COLLECTION,
      ref => ref.where('itemId', '==', eventId)
                .orderBy('timestamp', 'desc')
    );

    return this.commentsCollection.valueChanges();
  }


  // eslint-disable-next-line max-len
  async addComment(itemId: string, itemName: string, commentatorDisplayedName: string, commentatorDisplayedImage: string, message: string, commentType: CommentType): Promise<void> {

    const currentUser = await this.afAuth.currentUser;
    const id: string = this.afs.createId();
    const timestamp = this.appointmentSrv.getTimestamp();

    const newComment: IComment = {
      id,
      itemId,
      itemName,
      commentatorDisplayedName,
      commentatorDisplayedImage,
      userUid: currentUser.uid,
      userName: currentUser.displayName,
      userImage: currentUser.photoURL,
      message,
      timestamp,
      commentType
    };

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.COMMENT,
      itemId, itemName, BaseType.EVENT,
      currentUser.uid, currentUser.displayName,
      message
    );

    this.commentsCollection.doc(id).set(
      newComment
    );
  }

  deleteComment(id: string): void {
    this.commentsDoc = this.afs.doc<IComment>(`${COMMENTS_COLLECTION}/${id}`);
    this.commentsDoc.delete();
  }
}
