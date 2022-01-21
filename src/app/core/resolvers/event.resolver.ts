import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IEvent } from '@models/event';
import { ITags } from '@models/tags';
import { EventService } from '@services/events.service';

const EVENTS_COLLECTION = 'eventos';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<Observable<any>> {

  constructor(
    private eventSrv: EventService
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot): Promise<Observable<ITags>> {
    const eventId = route.paramMap.get('id');
    return this.eventSrv.getTagsFromEvent(eventId);

    // const eventTags = {
    //   name: 'Carrera Nocturna 5',
    //   description: 'Carrera Nocturna Descripción 5',
    //eslint-disable-next-line max-len
    //   image: 'https://firebasestorage.googleapis.com/v0/b/info-rincon.appspot.com/o/thumbnails%2Fcartel-carrera-nocturna-rincon-de-soto-2022-mini_600x600.jpg?alt=media',
    //   imageWidth: 424,
    //   imageHeight: 600,
    // } as ITags;

    // console.log(`resolver eventTags: ${JSON.stringify(eventTags)}`);
    // return of(eventTags);
  }
}
