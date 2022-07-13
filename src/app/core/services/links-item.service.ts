/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable } from 'rxjs';

import { BaseType, IBase } from '@models/base';
import { ILinkItem, LinkItem } from '@models/link-item';
import { AppointmentsService } from '@services/appointments.service';

const LINKS_ITEM_COLLECTION = 'enlaces-item';

@Injectable({
  providedIn: 'root'
})
export class LinksItemService {

  private linksItemCollection!: AngularFirestoreCollection<ILinkItem>;
  private linkItemDoc!: AngularFirestoreDocument<ILinkItem>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService
  ) {
    this.linksItemCollection = afs.collection(LINKS_ITEM_COLLECTION);
  }

  getLinksItemByItemId(itemId: string): Observable<ILinkItem[]> {

    this.linksItemCollection = this.afs.collection<ILinkItem>(
      LINKS_ITEM_COLLECTION,
      ref => ref.where('itemId', '==', itemId)
                .where('active', '==', true)
                .orderBy('timestamp', 'desc')
  );

  return this.linksItemCollection.valueChanges();
}


  getLinksItemByRange(dateMin: string, dateMax: string): Observable<ILinkItem[]> {

      this.linksItemCollection = this.afs.collection<ILinkItem>(
        LINKS_ITEM_COLLECTION,
        ref => ref.where('active', '==', true)
                  .where('timestamp', '>=', dateMin)
                  .where('timestamp', '<=', dateMax)
                  .orderBy('timestamp', 'desc')
                  .limit(100)
    );

    return this.linksItemCollection.valueChanges();
  }

  // TODO Add Source params
  async addLinkItem(item: IBase, linkItemTypeKey: string, name: string, description: string, sourceUrl: string ): Promise<void> {

      const currentUser = await this.afAuth.currentUser;
      const linkItemType = LinkItem.getLinkItemType(linkItemTypeKey);

      const linkItem = LinkItem.InitDefault(
        item,
        linkItemType,
        name,
        description,
        sourceUrl,
        currentUser.uid,
        currentUser.displayName,
        'Usuario registrado'
        );

      const id = this.afs.createId();
      linkItem.id = id;
      linkItem.timestamp = this.appointmentSrv.getTimestamp();
      this.linksItemCollection.doc(id)
        .set(Object.assign({}, linkItem));
  }

  deleteLinkItem(linkItemid: string): void {
      this.linkItemDoc = this.afs.doc<ILinkItem>(`${LINKS_ITEM_COLLECTION}/${linkItemid}`);
      this.linkItemDoc.delete();
  }

}
