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
    console.log(`resolver eventId: ${eventId}`);
    // return of('Hola');
    return this.eventSrv.getTagsFromEvent(eventId);
  }
}
