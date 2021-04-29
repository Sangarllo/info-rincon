import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Entity } from 'src/app/core/models/entity';
import { IBase, BaseType } from 'src/app/core/models/base';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent {

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

      default:
        this.logSrv.error(`No implementado! (${JSON.stringify(baseItem)})`);
        break;
    }
  }
}
