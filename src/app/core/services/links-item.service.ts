/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable } from 'rxjs';

import { IBase } from '@models/base';
import { ILinkItem, LinkItem } from '@models/link-item';
import { LinkType } from '@models/link-item-type.enum';
import { AppointmentsService } from '@services/appointments.service';
import { ISource } from '@models/source';

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

  getLinksItemByItemId(itemId: string, linkType: LinkType): Observable<ILinkItem[]> {

    this.linksItemCollection = this.afs.collection<ILinkItem>(
      LINKS_ITEM_COLLECTION,
      ref => ref.where('itemId', '==', itemId)
                .where('active', '==', true)
                .where('linkType', '==', linkType)
                .orderBy('timestamp', 'desc')
  );

  return this.linksItemCollection.valueChanges();
}


  getLinksItemByRange(dateMin: string, dateMax: string, linkType: LinkType): Observable<ILinkItem[]> {

      this.linksItemCollection = this.afs.collection<ILinkItem>(
        LINKS_ITEM_COLLECTION,
        ref => ref.where('active', '==', true)
                  .where('timestamp', '>=', dateMin)
                  .where('timestamp', '<=', dateMax)
                  .where('linkType', '==', linkType)
                  .orderBy('timestamp', 'desc')
                  .limit(100)
    );

    return this.linksItemCollection.valueChanges();
  }

  // TODO Add Source params
  async addLinkItem(
      item: IBase,
      linkItemTypeKey: string, linkType: LinkType,
      name: string, description: string, sourceUrl: string,
      source?: ISource): Promise<void> {

      const currentUser = await this.afAuth.currentUser;
      let sourceUid = currentUser.uid;
      let sourceName = currentUser.displayName;
      let sourceType = 'Usuario registrado';

      if ( source ) {
        sourceUid = source.id;
        sourceName = source.name;
        sourceType = source.description;
      }

      const linkItemType = LinkItem.getLinkItemType(linkItemTypeKey);

      const linkItem = LinkItem.InitDefault(
        item,
        linkItemType,
        linkType,
        name,
        description,
        sourceUrl,
        sourceUid,
        sourceName,
        sourceType
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
