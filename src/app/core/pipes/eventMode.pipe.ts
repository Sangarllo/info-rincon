import { Pipe, PipeTransform } from '@angular/core';

import { EventMode } from '@models/event-mode.enum';

@Pipe({
  name: 'eventMode'
})
export class EventModePipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {

      case EventMode.SIMPLE:
        return 'EVENTO SENCILLO';

      case EventMode.SPLITTED:
        return 'EVENTO DESGLOSADO';

      case EventMode.SUPEREVENT:
        return 'SUPER EVENTO';


      default:
        return '🚧​​ TIPO NO DEFINIDO 🚧​';
    }
  }

}
