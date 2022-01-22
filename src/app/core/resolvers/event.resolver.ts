import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { SeoSocialShareData, SeoSocialShareService } from 'ngx-seo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEvent } from '@models/event';
import { ITags } from '@models/tags';
import { EventService } from '@services/events.service';
import { SeoService } from '@services/seo.service';

const EVENTS_COLLECTION = 'eventos';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<Observable<any>> {

  constructor(
    private eventSrv: EventService,
    // private seoSrv: SeoService,
    private seoSocialShareService: SeoSocialShareService,
    private angularFirestore: AngularFirestore,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const stateKey = state.url;

    const ref = this.angularFirestore.collection(EVENTS_COLLECTION);
    return ref
      .doc(route.params.id)
      .get()
      .pipe(
        map(doc => {
          const event = doc.data() as IEvent;

          const seoData: SeoSocialShareData = {
            title: event.name,
            description: event.description,
            image: event.imagePath,
            author: '...',
            keywords: `...`,
            url: `...`,
            // published: '...',
          };

          this.seoSocialShareService.setData(seoData);

          return event;
        })
      );
  }



  // resolve(route: ActivatedRouteSnapshot): Observable<ITags> {
  //   const eventId = route.paramMap.get('id');
  //   return this.eventSrv.getTagsFromEvent(eventId);

  //   // const eventTags = {
  //   //   name: 'Carrera Nocturna 5',
  //   //   description: 'Carrera Nocturna Descripción 5',
  //   eslint-disable-next-line max-len
  //   //   image: 'https://firebasestorage.googleapis.com/v0/b/info-rincon.appspot.com/o/thumbnails%2Fcartel-carrera-nocturna-rincon-de-soto-2022-mini_600x600.jpg?alt=media',
  //   //   imageWidth: 424,
  //   //   imageHeight: 600,
  //   // } as ITags;

  //   // console.log(`resolver eventTags: ${JSON.stringify(eventTags)}`);
  //   // return of(eventTags);
  // }
}
