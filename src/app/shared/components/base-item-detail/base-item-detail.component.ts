import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Entity } from '@models/entity';
import { IBase, BaseType } from '@models/base';

@Component({
  selector: 'app-base-item-detail',
  templateUrl: './base-item-detail.component.html',
  styleUrls: ['./base-item-detail.component.scss']
})
export class BaseItemDetailComponent {

  @Input() baseItem: IBase;

  constructor(
    private router: Router,
  ) { }

  gotoBaseItem(baseItem: IBase): void {
    switch (baseItem.baseType) {

      case BaseType.ENTITY:
        this.router.navigate([`/${Entity.PATH_URL}/${baseItem.id}`]);
        break;

      default:
        console.log(`No implementado! (${JSON.stringify(baseItem)})`);
        break;
    }
  }
}
