import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBase, BaseType } from 'src/app/core/models/base';
import { INewsItem } from 'src/app/core/models/news';
import { AppointmentsService } from '@services/appointments.service';

const NEWS_COLLECTION = 'noticias';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private newsCollection!: AngularFirestoreCollection<INewsItem>;
  private newsItemDoc!: AngularFirestoreDocument<INewsItem>;

  constructor(
    private afs: AngularFirestore,
    private appointmentSvc: AppointmentsService,
  ) {
    this.newsCollection = afs.collection(NEWS_COLLECTION);
  }

  getAllNews(showOnlyActive: boolean, modeDashboard: boolean, sizeDashboard?: number): Observable<INewsItem[]> {

    if ( modeDashboard ) {
      this.newsCollection = this.afs.collection<INewsItem>(
        NEWS_COLLECTION,
        ref => ref.where('focused', '==', true)
                  .where('active', '==', true)
                  .where('status', '==', 'VISIBLE')
                  .orderBy('timestamp', 'desc')
                  .limit(sizeDashboard)
      );
    } else {
      if ( showOnlyActive ) {
        this.newsCollection = this.afs.collection<INewsItem>(
          NEWS_COLLECTION,
          ref => ref.where('active', '==', true)
                    .where('status', '==', 'VISIBLE')
                    .orderBy('timestamp', 'desc')
        );
      } else {
        this.newsCollection = this.afs.collection<INewsItem>(
          NEWS_COLLECTION,
          ref => ref.orderBy('timestamp', 'desc')
        );
      }
    }

    return this.newsCollection.valueChanges();
  }

  getAllNewsBase(): Observable<IBase[]> {
    this.newsCollection = this.afs.collection<INewsItem>(
      NEWS_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('name')
    );

    return this.newsCollection.valueChanges().pipe(
      map(news => news.map(newsItem => {
        if ( newsItem.active ) {
          return {
            id: newsItem.id,
            active: newsItem.active,
            name: newsItem.name,
            image: newsItem.image,
            baseType: BaseType.NEWS_ITEM,
            desc: newsItem.description
          };
        }
      }))
    );
  }

  getOneNewsItem(idNewsItem: string): Observable<INewsItem | undefined> {
    return this.newsCollection.doc(idNewsItem).valueChanges({ idField: 'id' });
  }

  addNewsItem(newsItem: INewsItem): void {
    newsItem.id = this.afs.createId();
    newsItem.timestamp = this.appointmentSvc.getTimestamp();
    this.newsCollection.doc(newsItem.id).set(newsItem);
  }

  updateNewsItem(newsItem: INewsItem): void {
    const idNewsItem = newsItem.id;
    this.newsItemDoc = this.afs.doc<INewsItem>(`${NEWS_COLLECTION}/${idNewsItem}`);
    newsItem.timestamp = this.appointmentSvc.getTimestamp();
    this.newsItemDoc.update(newsItem);
  }

  deleteNewsItem(newsItem: INewsItem): void {
    const idNewsItem = newsItem.id;
    newsItem.active = false;
    newsItem.timestamp = this.appointmentSvc.getTimestamp();
    this.newsItemDoc = this.afs.doc<INewsItem>(`${NEWS_COLLECTION}/${idNewsItem}`);
    this.newsItemDoc.update(newsItem);
  }
}
