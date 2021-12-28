import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBase, BaseType } from '@models/base';
import { ILink } from '@models/link';
import { AppointmentsService } from '@services/appointments.service';

const LINKS_COLLECTION = 'enlaces';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private linksCollection!: AngularFirestoreCollection<ILink>;
  private linkDoc!: AngularFirestoreDocument<ILink>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSvc: AppointmentsService,
  ) {
    this.linksCollection = afs.collection(LINKS_COLLECTION);
  }

  getAllLinks(showOnlyActive: boolean, modeDashboard: boolean, sizeDashboard?: number): Observable<ILink[]> {

    if ( modeDashboard ) {
      this.linksCollection = this.afs.collection<ILink>(
        LINKS_COLLECTION,
        ref => ref.where('focused', '==', true)
                  .where('active', '==', true)
                  .where('status', '==', 'VISIBLE')
                  .orderBy('timestamp', 'desc')
                  .limit(sizeDashboard)
      );
    } else {
      if ( showOnlyActive ) {
        this.linksCollection = this.afs.collection<ILink>(
          LINKS_COLLECTION,
          ref => ref.where('active', '==', true)
                    .where('status', '==', 'VISIBLE')
                    .orderBy('timestamp', 'desc')
        );
      } else {
        this.linksCollection = this.afs.collection<ILink>(
          LINKS_COLLECTION,
          ref => ref.orderBy('timestamp', 'desc')
        );
      }
    }

    return this.linksCollection.valueChanges();
  }

  getAllLinksBase(): Observable<IBase[]> {
    this.linksCollection = this.afs.collection<ILink>(
      LINKS_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.linksCollection.valueChanges().pipe(
      map(links => links.map(link => {
        if ( link.active ) {
          return {
            id: link.id,
            active: link.active,
            name: link.name,
            imageId: link.imageId,
            imagePath: link.imagePath,
            baseType: BaseType.LINK,
            description: link.description
          };
        }
      }))
    );
  }

  getOneLink(idLink: string): Observable<ILink | undefined> {
    return this.linksCollection.doc(idLink).valueChanges({ idField: 'id' });
  }

  addLink(link: ILink): void {
    link.id = this.afs.createId();
    link.timestamp = this.appointmentSvc.getTimestamp();
    this.linksCollection.doc(link.id).set(link);
  }

  updateLink(link: ILink): void {
    const idLink = link.id;
    this.linkDoc = this.afs.doc<ILink>(`${LINKS_COLLECTION}/${idLink}`);
    link.timestamp = this.appointmentSvc.getTimestamp();
    this.linkDoc.update(link);
  }

  deleteLink(link: ILink): void {
    const idLink = link.id;
    link.active = false;
    link.timestamp = this.appointmentSvc.getTimestamp();
    this.linkDoc = this.afs.doc<ILink>(`${LINKS_COLLECTION}/${idLink}`);
    this.linkDoc.update(link);
  }
}
