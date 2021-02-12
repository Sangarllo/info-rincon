import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IAuditItem, AuditItem, AuditType } from '@models/audit';
import { AppointmentsService } from '@services/appointments.service';

const AUDIT_COLLECTION = 'audit';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private auditCollection!: AngularFirestoreCollection<IAuditItem>;
  private auditDoc!: AngularFirestoreDocument<IAuditItem>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService
  ) {
    this.auditCollection = afs.collection(AUDIT_COLLECTION);
  }

  getAllAuditItemsByUser(userId: string): Observable<IAuditItem[]> {
    this.auditCollection = this.afs.collection<IAuditItem>(
      AUDIT_COLLECTION,
      ref => ref.where('userId', '==', userId)
                .orderBy('timestamp','desc')
    );

    return this.auditCollection.valueChanges();
  }

  addAuditItem(type: AuditType, user: any, desc?: string ): void {
    const timestamp = this.appointmentSrv.getTimestamp();
    const auditItem = AuditItem.InitDefault(type, user, timestamp, desc);
    this.auditCollection.add({...auditItem});
  }
}
