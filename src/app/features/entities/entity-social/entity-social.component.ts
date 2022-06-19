/* eslint-disable max-len */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable, Subscription, timer } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { AuthService } from '@auth/auth.service';
import { IEvent } from '@models/event';
import { IItemSocial } from '@models/item-social';
// import { CommentType, IComment } from '@models/comment';
import { IUser } from '@models/user';
// import { CommentsService } from '@services/comments.service';
import { ItemSocialService } from '@services/items-social.service';
import { UserService } from '@services/users.service';
import { BaseType } from '@models/base';

// import { CommentsDialogComponent } from '@shared/components/comments-dialog/comments-dialog.component';

@Component({
  selector: 'app-entity-social',
  templateUrl: './entity-social.component.html',
  styleUrls: ['./entity-social.component.scss']
})
export class EntitySocialComponent implements OnInit, OnDestroy {

  @Input() entity: IEvent;
  @Input() userLogged: IUser;

  // public comments$: Observable<IComment[]>;
  public itemSocial: IItemSocial;

  public dialogConfig = new MatDialogConfig();
  // public BTN_IMG_COMMENTS = 'assets/svg/comments.svg';
  public BTN_IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public BTN_IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';
  // public BTN_IMG_CLAP_ON = 'assets/svg/clap-on.svg';
  // public BTN_IMG_CLAP_OFF = 'assets/svg/clap-off.svg';

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


  public setEntityFav(isFav: boolean): void {

    this.userLogged.favEntities = this.userLogged.favEntities ?? [];
    this.userLogged.favEntities = this.userLogged.favEntities.filter( (eventId: string) => eventId !== this.entity.id );

    const itemName = this.entity.name;
    const itemId = this.entity.id;

    if ( isFav ) {
      this.userLogged.favEntities.push(itemId);
      this.itemSocialSrv.addFavourite(itemId, BaseType.ENTITY, itemName, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad se ha convertido en uno de tus favoritas',
        confirmButtonColor: '#003A59',
      });
    } else {
      this.itemSocialSrv.removeFavourite(itemId, BaseType.ENTITY, itemName, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad ha dejado de estar entre tus favoritas',
        confirmButtonColor: '#003A59',
      });
    }

    this.userSrv.updateUser(this.userLogged);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
