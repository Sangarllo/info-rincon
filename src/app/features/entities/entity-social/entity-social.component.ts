/* eslint-disable max-len */
import { Component, OnInit, Input } from '@angular/core';

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
export class EntitySocialComponent implements OnInit {

  @Input() entity: IEvent;
  @Input() userLogged: IUser;

  // public comments$: Observable<IComment[]>;
  public itemSocial: IItemSocial;
  public isFav = false;
  // public applause = false;

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
    // private commentSrv: CommentsService,
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
              if ( this.userLogged.favEntities?.includes(this.entity?.id) ) {
                  this.isFav = true;
              }
          });
          }
      });

    this.listOfObservers.push( subs1$ );

  }


  public isFavorite(isFav: boolean): void {

    this.userLogged.favEntities = this.userLogged.favEntities ?? [];
    this.userLogged.favEntities = this.userLogged.favEntities.filter( (eventId: string) => eventId !== this.entity.id );

    this.isFav = !this.isFav;
    if ( isFav ) {
      this.userLogged.favEntities.push(this.entity.id);
      this.itemSocialSrv.addFavourite(this.itemSocial.id, BaseType.ENTITY, this.entity.name, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad se ha convertido en uno de tus favoritas',
        confirmButtonColor: '#003A59',
      });
    } else {
      this.itemSocialSrv.removeFavourite(this.itemSocial.id, BaseType.ENTITY, this.entity.name, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad ha dejado de estar entre tus favoritas',
        confirmButtonColor: '#003A59',
      });
    }

    this.userSrv.updateUser(this.userLogged);
  }
}
