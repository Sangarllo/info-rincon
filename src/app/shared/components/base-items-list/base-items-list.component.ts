/* eslint-disable max-len */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { IBase, BaseType } from '@models/base';
import { Entity } from '@models/entity';
import { Event } from '@models/event';
import { IUser } from '@models/user';
import { ItemSocialService } from '@services/items-social.service';
import { LogService } from '@services/log.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'sh-base-items-list',
  templateUrl: './base-items-list.component.html',
  styleUrls: ['./base-items-list.component.scss']

})
export class BaseItemsListComponent {

  @Input() baseItems: IBase[];
  @Input() order = 'row';
  @Input() modeAdmin: boolean;
  @Input() baseItemSelected: string;
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

  public setEntityFav(isFav: boolean, entityItem: IBase): void {

    this.userLogged.favEntities = this.userLogged.favEntities ?? [];
    this.userLogged.favEntities = this.userLogged.favEntities.filter( (itemId: string) => itemId !== entityItem.id );

    const entityName = entityItem.name;
    const entityId = entityItem.id;

    if ( isFav ) {
            this.userLogged.favEntities.push(entityItem.id);
            this.itemSocialSrv.addFavourite(entityId, BaseType.ENTITY, entityName, this.userLogged.uid, this.userLogged.displayName);
            Swal.fire({
                  icon: 'success',
                  title: 'Esta entidad se ha convertido en una de tus favoritas',
                  confirmButtonColor: '#003A59',
            });

    } else {

          this.itemSocialSrv.removeFavourite(entityId, BaseType.ENTITY, entityName, this.userLogged.uid, this.userLogged.displayName);

          Swal.fire({
            icon: 'success',
            title: 'Esta entidad ha dejado de estar entre tus favoritas',
            confirmButtonColor: '#003A59',
          });
    }

    this.userSrv.updateUser(this.userLogged);
  }

  deleteBaseItem(base: IBase): void {
    this.deleteBase.emit(base);
  }
}
