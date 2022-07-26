/* eslint-disable max-len */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { IBase, BaseType } from '@models/base';
import { Entity } from '@models/entity';
import { Event } from '@models/event';
import { IUser } from '@models/user';
import { ItemSocialService } from '@services/items-social.service';
import { LogService } from '@services/log.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'sh-base-item-view',
  templateUrl: './base-item-view.component.html'
})
export class BaseItemViewComponent {

  @Input() baseItem: IBase;
  @Input() userLogged: IUser;
  @Output() deleteBase = new EventEmitter<IBase>();

  public BTN_IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public BTN_IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';

  constructor(
    private router: Router,
    private logSrv: LogService,
    private itemSocialSrv: ItemSocialService,
    private userSrv: UserService,
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

  public clickItem(baseItem: IBase): void {
    switch (baseItem.baseType) {

      case BaseType.EVENT:
          window.open(baseItem.imagePath, '_blank');
          break;

      case BaseType.ENTITY:
          this.router.navigate([`/${Entity.PATH_URL}/${baseItem.id}`]);
          break;
    }
  }

  public setFav(isFav: boolean, entityItem: IBase): void {

            this.itemSocialSrv.updateFavorite(
              isFav, this.userLogged,
              entityItem.id, entityItem.name, entityItem.baseType );
  }

  deleteBaseItem(base: IBase): void {
    this.deleteBase.emit(base);
  }
}
