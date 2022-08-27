import { Pipe, PipeTransform } from '@angular/core';

import { Status } from '@models/status.enum';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {

      case Status.Visible:
        return 'VISIBLE';

      case Status.Blocked:
        return 'BLOQUEADO';

      case Status.Editing:
        return 'EDITANDO';

      case Status.Deleted:
        return 'BORRADO';

      default:
        return '*** ERROR ***';
    }
  }

}
