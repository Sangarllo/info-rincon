import { Pipe, PipeTransform } from '@angular/core';

import { EventType } from '@models/event-type.enum';

@Pipe({
  name: 'eventType'
})
export class EventTypePipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {

      case EventType.SIMPLE:
        return 'EVENTO SENCILLO';

      case EventType.SPLITTED:
        return 'EVENTO DESGLOSADO';

      case EventType.SUPEREVENT:
        return 'SUPER EVENTO';


      default:
        return '🚧​​ TIPO NO DEFINIDO 🚧​';
    }
  }

}
