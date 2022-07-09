/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { IBase } from '@models/base';
import { LinkItem } from '@models/link-item';

// eslint-disable-next-line no-shadow
export enum SwalMessage {
  NO_CHANGES = 'NO_CHANGES',
  OK_CHANGES = 'OK_CHANGES',
  GOTO_URL = 'GOTO_WEB',
  OTHER_CHANGES = 'OTHER_CHANGES'
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public swalFire(opt: SwalMessage, extraInfo?: string, base?: IBase): void {
    switch (opt) {
      case SwalMessage.NO_CHANGES:
        Swal.fire({
          icon: 'warning',
          title: 'Datos no modificados',
          text: `Has cerrado la ventana sin guardar ningún cambio`,
          confirmButtonColor: '#003A59',
        });
        break;

      case SwalMessage.OK_CHANGES:
        Swal.fire({
            icon: 'success',
            title: 'Datos guardados con éxito',
            text: `La información sobre ${extraInfo} ha sido guarda correctamente`,
            confirmButtonColor: '#003A59',
        });
        break;

      case SwalMessage.GOTO_URL:

        const linkItemType = LinkItem.getLinkItemType(base.name);

        Swal.fire({
          title: `${linkItemType} ${base.name}`,
          // eslint-disable-next-line max-len
          html: `Si aceptas accederás a una web externa:<br/><br/><h1>${base.description}</h1><a href='${base.sourceUrl}' style='color:red'>${base.sourceUrl}</a>`,
          imageUrl: base.name,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: `Sí, acceder a ${base.name}`
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(base.sourceUrl, '_blank');
          }
        });
        break;

      case SwalMessage.OTHER_CHANGES:
        Swal.fire({
              icon: 'success',
              title: extraInfo,
              confirmButtonColor: '#003A59',
          });
          break;

      default:
        break;
    }
  }

  public getDistanceTimestamp(timestamp: string): string {
    const timestampDate = new Date(timestamp);
    return formatDistance(
      timestampDate,
      new Date(),
      {locale: es}
    );
  }

  public move(input: IBase[], from: number, to: number): IBase[] {
    let numberOfDeletedElm = 1;

    const elm = input.splice(from, numberOfDeletedElm)[0];

    numberOfDeletedElm = 0;

    return input.splice(to, numberOfDeletedElm, elm);
  }

  public getGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
