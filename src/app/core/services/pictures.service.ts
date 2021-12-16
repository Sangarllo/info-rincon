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

  getPictureFromImage(imageId: string): Observable<IPicture> {
    if ( imageId === null || imageId === undefined || imageId === '' ) {
      return of(Picture.InitDefault());
    } else if ( imageId.length === 20 ) {
      return this.getOnePicture(imageId);
    } else {
      return of(Picture.InitByPath(imageId));
    }
  }

  getSeveralPicturesFromImages(images: string[]): Observable<IPicture[]>{
    const eventsObs: Observable<IPicture>[] = [];
    images.forEach(imageId => {
      eventsObs.push(this.getPictureFromImage(imageId));
    });
    return combineLatest(eventsObs);
  }

  getImagesFromPictures(pictures: IPicture[]): string[] {
    return pictures.map(picture => Picture.getImageIdFromPicture(picture));
  }

  getThumbnail(fileName): string {
    return this.getResizedName(fileName, Picture.THUMB_SIZE);
  }

  private getResizedName(fileName, dimensions): string {
    const index1 = fileName.lastIndexOf('/o/');
    const path1 = fileName.substring(0, index1 + 3);
    // console.log(`image2: ${path1}`);
    const path1Rem = fileName.substring(index1 + 3);
    const index2 = path1Rem.lastIndexOf('.');
    const path2 = path1Rem.substring(0, index2);
    const path2Rem = path1Rem.substring(index2);
    // console.log(`image3: ${path2}`);
    const fileNameResized = `${path1}thumbnails%2F${path2}_${dimensions}${path2Rem}`;
    const index3 = fileNameResized.lastIndexOf('&token');

    //console.log(`image:: ${fileNameResized.substring(0, index3)}`);
    return `${fileNameResized.substring(0, index3)}`;
  }
}
