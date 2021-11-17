import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { IBase, BaseType } from '@models/base';
import { Entity } from '@models/entity';
import { Event } from '@models/event';
import { LogService } from '@services/log.service';

@Component({
  selector: 'sh-base-items-list',
  templateUrl: './base-items-list.component.html',
  styleUrls: ['./base-items-list.component.scss']

})
export class BaseItemsListComponent {

  @Input() baseItems: IBase[];
  @Input() order = 'row';
  @Input() modeAdmin: boolean;
  @Output() deleteBase = new EventEmitter<IBase>();


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

  deleteBaseItem(base: IBase): void {
    this.deleteBase.emit(base);
  }
}
