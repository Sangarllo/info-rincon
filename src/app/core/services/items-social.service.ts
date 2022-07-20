/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { IItemSocial } from '@models/item-social';
import { AuditSocialType } from '@models/audit-social';
import { BaseType } from '@models/base';
import { IUser } from '@models/user';
import { AuditSocialService } from '@services/audit-social.service';
import { SupportedItemsService } from '@services/supported-items.service';
import { UserService } from '@services/users.service';

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
    private supportedItemsService: SupportedItemsService,
    private userSrv: UserService,
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

  public async updateFavorite(
    isFav: boolean, userLogged: IUser,
    itemId: string, itemName: string, baseType: BaseType,
    itemSocial?: IItemSocial
    ): Promise<void> {

      this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemId}`);

      // 1. Update list of favorite-items
      let favItems = [];
      switch(baseType) {
          case BaseType.EVENT:
              favItems = userLogged.favEvents;
              break;
          case BaseType.ENTITY:
              favItems = userLogged.favEntities;
              break;
      }
      favItems = favItems.filter( (id: string) => id !== itemId );

      // 2. Update item-social element
      if ( isFav ) {

          favItems.push(itemId);

          // -> ItemSocial
          if ( itemSocial ) {
            if ( itemSocial.usersFavs ) {
                itemSocial.usersFavs = itemSocial.usersFavs.filter( (id: string) => id !== userLogged.uid );
                itemSocial.usersFavs.push(userLogged.uid);
            } else {
                itemSocial.usersFavs = [userLogged.uid];
            }
            this.itemSocialDoc.set(itemSocial, { merge: true });
          } else {
            this.itemSocialDoc.ref.update({
              usersFavs: firebase.firestore.FieldValue.arrayUnion(userLogged.uid)
            });
          }

          // -> AuditSocial
          this.auditSocialSrv.addAuditSocialItem(
            AuditSocialType.FAV_ON,
            itemId, itemName, baseType,
            userLogged.uid, userLogged.displayName,
            ''
          );

          Swal.fire({
              icon: 'success',
              title: 'Se ha convertido en uno de tus favoritos',
              confirmButtonColor: '#003A59',
          });
      } else {

          // -> ItemSocial
          if ( itemSocial ) {
              itemSocial.usersFavs = itemSocial.usersFavs.filter( (uid: string) => uid !== userLogged.uid );
              itemSocial.usersFavs = favItems;
              this.itemSocialDoc.set(itemSocial, { merge: true });
          } else {
                this.itemSocialDoc.ref.update({
                    usersFavs: firebase.firestore.FieldValue.arrayRemove(userLogged.uid)
                });

          };

          // -> AuditSocial
          this.auditSocialSrv.addAuditSocialItem(
            AuditSocialType.FAV_OFF,
            itemId, itemName, baseType,
            userLogged.uid, userLogged.displayName,
            ''
          );

          Swal.fire({
              icon: 'success',
              title: 'Ha dejado de estar entre tus favoritos',
              confirmButtonColor: '#003A59',
          });
      }

      // 3. Update user element
      switch(baseType) {
          case BaseType.EVENT:
              userLogged.favEvents = favItems;
              break;
          case BaseType.ENTITY:
              userLogged.favEntities = favItems;
              break;
      }
      this.userSrv.updateUser(userLogged);
  }

  public async addClaps(itemSocial: IItemSocial, baseType: BaseType, itemName: string, userUid: string, userName: string): Promise<void> {
    const itemId = itemSocial.id;
    this.itemSocialDoc = this.afs.doc<IItemSocial>(`${ITEMS_SOCIAL_COLLECTION}/${itemId}`);
    itemSocial.nClaps = ( itemSocial.nClaps ) ? itemSocial.nClaps+1 : 1;

    // Support
    this.supportedItemsService.addSupportedItem(
      itemId,
      baseType,
    );

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

