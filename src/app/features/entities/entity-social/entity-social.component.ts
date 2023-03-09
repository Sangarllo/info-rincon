/* eslint-disable max-len */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable, Subscription, timer } from 'rxjs';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';

import { AuthService } from '@auth/auth.service';
import { IEvent } from '@models/event';
import { IItemSocial } from '@models/item-social';
import { IUser } from '@models/user';
import { ItemSocialService } from '@services/items-social.service';
import { UserService } from '@services/users.service';
import { BaseType } from '@models/base';

@Component({
  selector: 'app-entity-social',
  templateUrl: './entity-social.component.html',
  styleUrls: ['./entity-social.component.scss']
})
export class EntitySocialComponent implements OnInit, OnDestroy {

  @Input() entity: IEvent;
  @Input() userLogged: IUser;

  public itemSocial: IItemSocial;

  public dialogConfig = new MatDialogConfig();
  public BTN_IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public BTN_IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';

  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    public authSvc: AuthService,
    private itemSocialSrv: ItemSocialService,
    private userSrv: UserService,
  ) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';

  }

  ngOnInit(): void {

    // this.comments$ = this.commentSrv.getAllComments(this.entity.id);

    this.itemSocialSrv.getItemSocial(this.entity.id)
    .subscribe( (itemSocial: IItemSocial) => {
        this.itemSocial = itemSocial;
    });

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
          });
          }
      });

    this.listOfObservers.push( subs1$ );
  }

  public setFav(isFav: boolean): void {
    this.itemSocialSrv.updateFavorite(
      isFav, this.userLogged,
      this.entity.id, this.entity.name, BaseType.ENTITY,
      this.itemSocial
    );
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
