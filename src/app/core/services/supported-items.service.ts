/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { BaseType } from '@models/base';
import { ISupportedItem } from '@models/supported-item';
import { AppointmentsService } from '@services/appointments.service';

const SUPPORTED_ITEMS_COLLECTION = 'supported-items';

@Injectable({
  providedIn: 'root'
})
export class SupportedItemsService {

  private SupportedItemsCollection!: AngularFirestoreCollection<ISupportedItem>;
  private supportedItemDoc!: AngularFirestoreDocument<ISupportedItem>;

  private readonly N_DAYS_AHEAD = environment.supportedNDaysBehind;

  constructor(
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService,
  ) {
    this.SupportedItemsCollection = afs.collection(SUPPORTED_ITEMS_COLLECTION);
  }

  // TODO GetAll by BaseType
  public getAllSupportedItems(): Observable<ISupportedItem[]> {

    const dateMin = new Date();
    dateMin.setDate(dateMin.getDate() - this.N_DAYS_AHEAD);
    const dateMinStr = dateMin.toISOString().substr(0, 10);

    this.SupportedItemsCollection = this.afs.collection<ISupportedItem>(
      SUPPORTED_ITEMS_COLLECTION,
      ref => ref.where('timestamp', '>=', dateMinStr)
    );

    return this.SupportedItemsCollection.valueChanges();
  }

  public getSupportedData(): void {
    const data = [];
    this.getAllSupportedItems()
      .subscribe((supported: ISupportedItem[]) => {
        for (const item of supported) {
          console.log(`item: ${JSON.stringify(item)}`);
          const key = item.id;
          if ( data[item.id] ) {
            data[item.id]++;
          } else {
            data[item.id] = 0;
          }
        }
        console.log(JSON.stringify(data));
      });
  }

  addSupportedItem(itemSupportedId: string, baseType: BaseType): void {
    const timestamp = this.appointmentSrv.getTimestamp();
    this.SupportedItemsCollection.doc(itemSupportedId).set({
      id: itemSupportedId,
      baseType,
      timestamp,
    });
  }
}

