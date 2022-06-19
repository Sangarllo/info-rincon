/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

import { Observable } from 'rxjs';

import { IItemSocial } from '@models/item-social';
import { AuditSocialType } from '@models/audit-social';
import { BaseType } from '@models/base';
import { AuditSocialService } from '@services/audit-social.service';

const ITEMS_SOCIAL_COLLECTION = 'eventos-social'; // TODO rename items-social

@Injectable({
  providedIn: 'root'
})
export class ItemSocialService {

  private itemSocialCollection!: AngularFirestoreCollection<IItemSocial>;
  private itemSocialDoc!: AngularFirestoreDocument<IItemSocial>;

  constructor(
    private afs: AngularFirestore,
    private auditSocialSrv: AuditSocialService,
  ) {
    this.itemSocialCollection = afs.collection(ITEMS_SOCIAL_COLLECTION);
  }

  // TODO GetAll by BaseType
  public getAllItemsSocial(): Observable<IItemSocial[]> {
    this.itemSocialCollection = this.afs.collection<IItemSocial>(
      ITEMS_SOCIAL_COLLECTION
    );
    return this.itemSocialCollection.valueChanges();
  }

  public getItemSocial(itemSocialId: string): Observable<IItemSocial> {
    return this.itemSocialCollection.doc(itemSocialId).valueChanges({ idField: 'id' });
  }

  addItemSocial(itemSocialId: string, baseType: BaseType): void {
    this.itemSocialCollection.doc(itemSocialId).set({
      id: itemSocialId,
      baseType,
      usersFavs: [],
      nClaps: 0,
    });
  }

  public async updateItemSocial(itemSocial: IItemSocial): Promise<void> {

    const itemSocialId = itemSocial.id;
    this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemSocialId}`);

    return this.itemSocialDoc.set(itemSocial, { merge: true });
  }


  public async addFavourite(itemSocialId: string, baseType: BaseType, itemName: string, userUid: string, userName: string): Promise<void> {

    this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemSocialId}`);

    this.itemSocialDoc.ref.update({ usersFavs: firebase.firestore.FieldValue.arrayUnion(userUid) });

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.FAV_ON,
      itemSocialId, itemName, baseType,
      userUid, userName,
      ''
    );
  }

  public async removeFavourite(itemSocialId: string, baseType: BaseType, itemName: string, userUid: string, userName: string): Promise<void> {

    this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemSocialId}`);

    this.itemSocialDoc.ref.update({ usersFavs: firebase.firestore.FieldValue.arrayRemove(userUid) });

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.FAV_OFF,
      itemSocialId, itemName, baseType,
      userUid, userName,
      ''
    );
  }

  public async addClaps(itemSocial: IItemSocial, baseType: BaseType, itemName: string, userUid: string, userName: string): Promise<void> {
    const itemId = itemSocial.id;
    this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemId}`);
    itemSocial.nClaps = ( itemSocial.nClaps ) ? itemSocial.nClaps+1 : 1;

    // Audit
    this.auditSocialSrv.addAuditSocialItem(
      AuditSocialType.CLAP,
      itemId, itemName, baseType,
      userUid, userName,
      ''
    );

    return this.itemSocialDoc.set(itemSocial, { merge: true });
  }
}

