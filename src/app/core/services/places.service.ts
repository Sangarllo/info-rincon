import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPlace } from '@models/place';
import { IBase, BaseType } from '@models/base';

const PLACES_COLLECTION = 'lugares';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  private placeCollection!: AngularFirestoreCollection<IPlace>;
  private placeDoc!: AngularFirestoreDocument<IPlace>;

  constructor(private afs: AngularFirestore) {
    this.placeCollection = afs.collection(PLACES_COLLECTION);
  }

  getAllPlaces(): Observable<IPlace[]> {
    this.placeCollection = this.afs.collection<IPlace>(
      PLACES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.placeCollection.valueChanges();
  }

  getAllPlacesBase(): Observable<IBase[]> {
    this.placeCollection = this.afs.collection<IPlace>(
      PLACES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.placeCollection.valueChanges().pipe(
      map(places => places.map(place => {
        if ( place.active ) {
          return {
            id: place.id,
            active: place.active,
            name: place.name,
            image: place.image,
            baseType: BaseType.PLACE,
            description: place.locality
          };
        }
      }))
    );
  }

  getOnePlace(idPlace: string): Observable<IPlace | undefined> {
    return this.placeCollection.doc(idPlace).valueChanges({ idField: 'id' });
  }

  addPlace(place: IPlace): void {
    place.id = this.afs.createId();
    this.placeCollection.doc(place.id).set(place);
  }

  updatePlace(place: IPlace): void {
    const idPlace = place.id;
    this.placeDoc = this.afs.doc<IPlace>(`${PLACES_COLLECTION}/${idPlace}`);
    this.placeDoc.update(place);
  }

  deletePlace(place: IPlace): void {
    const idPlace = place.id;
    place.active = false;
    this.placeDoc = this.afs.doc<IPlace>(`${PLACES_COLLECTION}/${idPlace}`);
    this.placeDoc.update(place);
  }

}
