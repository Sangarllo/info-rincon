/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { BaseType } from '@models/base';
import { IAuditSocialItem, AuditSocialItem, AuditSocialType } from '@models/audit-social';
import { AppointmentsService } from '@services/appointments.service';

const AUDIT_SOCIAL_COLLECTION = 'audit-social';

@Injectable({
  providedIn: 'root'
})
export class AuditSocialService {

  private auditSocialCollection!: AngularFirestoreCollection<IAuditSocialItem>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService
  ) {
    this.auditSocialCollection = afs.collection(AUDIT_SOCIAL_COLLECTION);
  }

  getAuditItemsByRange(dateMin: string, dateMax: string): Observable<IAuditSocialItem[]> {

      this.auditSocialCollection = this.afs.collection<IAuditSocialItem>(
        AUDIT_SOCIAL_COLLECTION,
        ref => ref.where('timestamp', '>=', dateMin)
                  .where('timestamp', '<=', dateMax)
                  .orderBy('timestamp', 'desc')
                  .limit(100)
    );

    return this.auditSocialCollection.valueChanges();
  }

  addAuditSocialItem(type: AuditSocialType, itemId: string, itemName: string, itemType: BaseType, userUid: string, userName: string, text?: string ): void {
      const timestamp = this.appointmentSrv.getTimestamp();
      const auditSocialItem = AuditSocialItem.InitDefault(type, timestamp, itemId, itemName, itemType, userUid, userName, text);
      this.auditSocialCollection.add({...auditSocialItem});
  }
}
