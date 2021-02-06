import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBase, BaseType } from '@models/base';
import { INotice } from '@models/notice';
import { AppointmentsService } from '@services/appointments.service';

const NOTICES_COLLECTION = 'avisos';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private noticeCollection!: AngularFirestoreCollection<INotice>;
  private noticeDoc!: AngularFirestoreDocument<INotice>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSvc: AppointmentsService,
  ) {
    this.noticeCollection = afs.collection(NOTICES_COLLECTION);
  }

  getAllNotices(showOnlyActive: boolean, modeDashboard: boolean, sizeDashboard?: number): Observable<INotice[]> {

    if ( modeDashboard ) {
      this.noticeCollection = this.afs.collection<INotice>(
        NOTICES_COLLECTION,
        ref => ref.where('focused', '==', true)
                  .where('active', '==', true)
                  .where('status', '==', 'VISIBLE')
                  .orderBy('timestamp', 'desc')
                  .limit(sizeDashboard)
      );
    } else {
      if ( showOnlyActive ) {
        this.noticeCollection = this.afs.collection<INotice>(
          NOTICES_COLLECTION,
          ref => ref.where('active', '==', true)
                    .where('status', '==', 'VISIBLE')
                    .orderBy('timestamp', 'desc')
        );
      } else {
        this.noticeCollection = this.afs.collection<INotice>(
          NOTICES_COLLECTION,
          ref => ref.orderBy('timestamp', 'desc')
        );
      }
    }

    return this.noticeCollection.valueChanges();
  }

  getAllNoticesBase(): Observable<IBase[]> {
    this.noticeCollection = this.afs.collection<INotice>(
      NOTICES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.noticeCollection.valueChanges().pipe(
      map(notices => notices.map(notice => {
        if ( notice.active ) {
          return {
            id: notice.id,
            active: notice.active,
            name: notice.name,
            image: notice.image,
            baseType: BaseType.NOTICE,
            desc: notice.description
          };
        }
      }))
    );
  }

  getOneNotice(idNotice: string): Observable<INotice   | undefined> {
    return this.noticeCollection.doc(idNotice).valueChanges({ idField: 'id' });
  }

  addNotice(notice: INotice): void {
    notice.id = this.afs.createId();
    notice.timestamp = this.appointmentSvc.getTimestamp();
    this.noticeCollection.doc(notice.id).set(notice);
  }

  updateNotice(notice: INotice): void {
    const idNotice = notice.id;
    this.noticeDoc = this.afs.doc<INotice>(`${NOTICES_COLLECTION}/${idNotice}`);
    notice.timestamp = this.appointmentSvc.getTimestamp();
    this.noticeDoc.update(notice);
  }

  deleteNotice(notice: INotice): void {
    const idNotice = notice.id;
    notice.active = false;
    notice.timestamp = this.appointmentSvc.getTimestamp();
    this.noticeDoc = this.afs.doc<INotice>(`${NOTICES_COLLECTION}/${idNotice}`);
    this.noticeDoc.update(notice);
  }
}
