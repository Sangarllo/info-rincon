/* eslint-disable max-len */
import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subscription, timer } from 'rxjs';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import Swal from 'sweetalert2';

import { AuthService } from '@auth/auth.service';
import { IEvent } from '@models/event';
import { IItemSocial } from '@models/item-social';
import { CommentType, IComment } from '@models/comment';
import { IUser } from '@models/user';
import { CommentsService } from '@services/comments.service';
import { ItemSocialService } from '@services/items-social.service';
import { UserService } from '@services/users.service';

import { CommentsDialogComponent } from '@shared/components/comments-dialog/comments-dialog.component';
import { BaseType } from '@models/base';
import { IEntity } from '@models/entity';

@Component({
  selector: 'app-event-social',
  templateUrl: './event-social.component.html',
  styleUrls: ['./event-social.component.scss']
})
export class EventSocialComponent implements OnInit {

  @Input() event: IEvent;
  @Input() userLogged: IUser;

  public comments$: Observable<IComment[]>;
  public itemSocial: IItemSocial;
  public isFav = false;
  public applause = false;

  public dialogConfig = new MatDialogConfig();
  public BTN_IMG_COMMENTS = 'assets/svg/comments.svg';
  public BTN_IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public BTN_IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';
  public BTN_IMG_CLAP_ON = 'assets/svg/clap-on.svg';
  public BTN_IMG_CLAP_OFF = 'assets/svg/clap-off.svg';

  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    public authSvc: AuthService,
    private commentSrv: CommentsService,
    private itemSocialSrv: ItemSocialService,
    private userSrv: UserService,
  ) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';

  }

  ngOnInit(): void {

    this.comments$ = this.commentSrv.getAllComments(this.event.id);

    this.itemSocialSrv.getItemSocial(this.event.id)
    .subscribe( (itemSocial: IItemSocial) => {
        this.itemSocial = itemSocial;
    });

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
              if ( this.userLogged.favEvents?.includes(this.event?.id) ) {
                  this.isFav = true;
              }
          });
          }
      });

    this.listOfObservers.push( subs1$ );

  }

  public viewComments(nComments: number): void {

    const userRole = this.userLogged?.role ?? '';

    if ( nComments > 0 || ['SUPER', 'ADMIN', 'AUTOR'].includes(userRole)) {

        const userEntities = this.userLogged?.entitiesAdmin.map( (entity: IEntity) => entity.id ) ?? [];

        this.dialogConfig.width = '600px';
        this.dialogConfig.height = '600px';
        this.dialogConfig.data = {
          itemId: this.event.id,
          itemName: this.event.name,
          UserUid: this.userLogged?.uid ?? '',
          UserName: this.userLogged?.displayName ?? '',
          UserImage: this.userLogged?.photoURL ?? '',
          UserRole: userRole,
          UserEntities: userEntities,
          EntityId: ( this.userLogged?.entityDefault?.id ?? '' ),
          EntityName: ( this.userLogged?.entityDefault?.name ?? '' ),
          EntityImage: ( this.userLogged?.entityDefault?.imagePath ?? '' ),
          EventEntities: this.event.entitiesArray ?? [],
          commentType: CommentType.Event,
        };

        const dialogRef = this.dialog.open(CommentsDialogComponent, this.dialogConfig);
      } else {
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'No hay comentarios en este evento',
        //   text: 'Todos los comentarios son escritos por administradores de la agenda, evitando así spam o malos entendidos',
        //   confirmButtonColor: '#003A59',
        // });
      }
  }

  public setFav(isFav: boolean): void {

    this.itemSocialSrv.updateFavorite(
      isFav, this.userLogged,
      this.event.id, this.event.name, BaseType.EVENT,
      this.itemSocial
    );
  }

  public clap(applause: boolean): void {
    if ( !applause ) {
      console.log(`applause!`);
      const userUid = this.userLogged?.uid ?? '';
      const userDisplayName = this.userLogged?.displayName ?? '';
      this.applause = true;
      this.itemSocialSrv.addClaps(this.itemSocial, BaseType.EVENT, this.event.name,  userUid, userDisplayName);
      const source = timer(3000);
      const subsTimer$ = source.subscribe(val => {
        this.applause = false;
      });
      this.listOfObservers.push( subsTimer$ );
    }
  }


}
