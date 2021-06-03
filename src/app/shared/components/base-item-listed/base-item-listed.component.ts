import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Entity } from '@models/entity';
import { Event } from '@models/event';
import { IBase, BaseType } from '@models/base';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-base-item-listed',
  templateUrl: './base-item-listed.component.html',
  styleUrls: ['./base-item-listed.component.scss']
})
export class BaseItemListedComponent {

  @Input() baseItem: IBase;

  constructor(
    private router: Router,
    private logSrv: LogService,
  ) { }

  gotoBaseItem(baseItem: IBase): void {
    switch (baseItem.baseType) {

      case BaseType.ENTITY:
        this.router.navigate([`/${Entity.PATH_URL}/${baseItem.id}`]);
        break;

      case BaseType.EVENT:
        const data = baseItem.id.split('_'); // May be an event or schedule
        const eventId = data[0];
        this.router.navigate([`/${Event.PATH_URL}/${eventId}`]);
        break;

      default:
        this.logSrv.error(`No implementado! (${JSON.stringify(baseItem)})`);
        break;
    }
  }
}
