import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { SeoSocialShareData, SeoSocialShareService } from 'ngx-seo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

import { IEvent } from '@models/event';

const EVENTS_COLLECTION = 'eventos';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<Observable<any>> {

  constructor(
    private seoSocialShareService: SeoSocialShareService,
    private angularFirestore: AngularFirestore,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    const eventId = route.params.id.split('_')[0];

    const ref = this.angularFirestore.collection(EVENTS_COLLECTION);
    return ref
      .doc(eventId)
      .get()
      .pipe(
        map(doc => {
          const event = doc.data() as IEvent;

          const seoData: SeoSocialShareData = {
            title: event.name,
            description: event.description,
            image: event.imagePath,
            author: 'Ayuntamiento de Rincón de Soto',
            keywords: `Rincón de Soto, ${event.sanitizedUrl}, ${event.categories?.map(category => category).join(', ')}`,
            url: `${environment.baseUrl}/eventos/${event.id}`,
            // published: '...',
          };

          this.seoSocialShareService.setData(seoData);

          return event;
        })
      );
  }
}
