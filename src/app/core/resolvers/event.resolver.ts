import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { EventService } from '@services/events.service';
import { ITags } from '@models/tags';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<Observable<any>> {

  constructor(
    private eventSrv: EventService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<ITags> {
    const eventId = route.paramMap.get('id');

    const eventTags = {
      name: 'Carrera Nocturna 3',
      description: 'Carrera Nocturna Descripción 3',
      //eslint-disable-next-line max-len
      image: 'https://firebasestorage.googleapis.com/v0/b/info-rincon.appspot.com/o/thumbnails%2Fcartel-carrera-nocturna-rincon-de-soto-2022-mini_600x600.jpg?alt=media',
      imageWidth: 424,
      imageHeight: 600,
    } as ITags;

    console.log(`resolver eventId: ${eventId}`);
    return of(eventTags);
    // return this.eventSrv.getTagsFromEvent(eventId);
  }
}
