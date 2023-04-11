// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { Injectable } from '@angular/core';

// import { SeoSocialShareData, SeoSocialShareService } from 'ngx-seo';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { environment } from '@environments/environment';

// import { IEvent } from '@models/event';
// import { IBase } from '@models/base';

// const EVENTS_COLLECTION = 'eventos';

// @Injectable({
//   providedIn: 'root'
// })
// export class EventResolver implements Resolve<Observable<any>> {

//   constructor(
//     private seoSocialShareService: SeoSocialShareService,
//     private angularFirestore: AngularFirestore,
//   ) {
//   }

//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<any> | Promise<any> | any {

//     const eventUrl = route.params.id;
//     const eventId = eventUrl.split('_')[0];
//     const subeventId = eventUrl.split('_')[1];
//     // console.log(`subeventId: ${subeventId}`);

//     let subevent: IBase;

//     const ref = this.angularFirestore.collection(EVENTS_COLLECTION);
//     return ref
//       .doc(eventId)
//       .get()
//       .pipe(
//         map(doc => {
//           const event = doc.data() as IEvent;

//           if (  subeventId ) {
//             subevent = event.scheduleItems?.find(item => item.id === eventUrl);
//             console.log(`schedule Resolver: ${JSON.stringify(subevent)}`);
//           }

//           const seoData: SeoSocialShareData = {
//             title: ( subeventId ) ?
//                 `${subevent.name} - ${event.name}` :
//                 event.name,
//             description: event.description,
//             image: event.imagePath,
//             author: 'Ayuntamiento de Rincón de Soto',
//             keywords: `Rincón de Soto, ${event.sanitizedUrl}, ${event.categories?.map(category => category).join(', ')}`,
//             url: `${environment.baseUrl}/eventos/${eventUrl}`,
//             // published: '...',
//           };

//           this.seoSocialShareService.setData(seoData);

//           return event;
//         })
//       );
//   }
// }
