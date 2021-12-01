import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, combineLatest, of } from 'rxjs';

import { IPicture, Picture } from '@models/picture';
import { AppointmentsService } from '@services/appointments.service';

const PICTURES_COLLECTION = 'imagenes';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  private pictureCollection!: AngularFirestoreCollection<IPicture>;
  private pictureDoc!: AngularFirestoreDocument<IPicture>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSrv: AppointmentsService
  ) {
    this.pictureCollection = afs.collection(PICTURES_COLLECTION);
  }

  getAllPictures(): Observable<IPicture[]> {
    this.pictureCollection = this.afs.collection<IPicture>(
      PICTURES_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('path')
    );

    return this.pictureCollection.valueChanges();
  }


  getOnePicture(idPicture: string): Observable<IPicture | undefined> {
    return this.pictureCollection
      .doc(idPicture)
      .valueChanges({ idField: 'id' });
  }

  getSeveralPictures(picturesIds: string[]): Observable<IPicture[]>{
    const eventsObs: Observable<IPicture>[] = [];
    picturesIds.forEach(pictureId => {
      eventsObs.push(this.getOnePicture(pictureId));
    });
    return combineLatest(eventsObs);
  }

  async addPicture(picture: IPicture): Promise<IPicture> {
    const pictureId = this.afs.createId();
    picture.id = pictureId;

    const timestamp = this.appointmentSrv.getTimestamp();
    picture.timestamp = timestamp;

    this.pictureCollection.doc(picture.id).set({
      ...picture
    });

    return Promise.resolve(picture);
  }

  updatePicture(picture: IPicture): void {
    const idPicture = picture.id;
    this.pictureDoc = this.afs.doc<IPicture>(`${PICTURES_COLLECTION}/${idPicture}`);

    const updPicture = { ...picture };
    this.pictureDoc.set(updPicture, { merge: true });
  }

  deletePicture(picture: IPicture): void {
    const idPicture = picture.id;
    picture.active = false;
    this.pictureDoc = this.afs.doc<IPicture>(`${PICTURES_COLLECTION}/${idPicture}`);
    this.pictureDoc.update(picture);
  }

  getPictureFromImage(image: string): Observable<IPicture> {
    console.log(`getPictureFromImage(${image})`);
    if ( image === null || image === undefined || image === '' ) {
      return of(Picture.InitDefault());
    } else if ( image.length === 20 ) {
      return this.getOnePicture(image);
    } else {
      return of(Picture.InitByPath(image));
    }
  }

  getSeveralPicturesFromImages(images: string[]): Observable<IPicture[]>{
    const eventsObs: Observable<IPicture>[] = [];
    images.forEach(image => {
      eventsObs.push(this.getPictureFromImage(image));
    });
    return combineLatest(eventsObs);
  }

  getImagesFromPictures(pictures: IPicture[]): string[] {
    return pictures.map(picture => Picture.getImageIdFromPicture(picture));
  }
}
