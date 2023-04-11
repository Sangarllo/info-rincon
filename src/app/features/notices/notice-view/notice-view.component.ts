/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { CommentType, IComment } from '@models/comment';
import { INotice, Notice } from '@models/notice';
import { IUser } from '@models/user';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';
import { UserService } from '@services/users.service';
import { CommentsService } from '@services/comments.service';
import { PictureService } from '@services/pictures.service';

import { CommentsDialogComponent } from '@shared/components/comments-dialog/comments-dialog.component';

@Component({
  selector: 'app-notice-view',
  templateUrl: './notice-view.component.html',
  styleUrls: ['./notice-view.component.scss']
})
export class NoticeViewComponent implements OnInit, OnDestroy {

  public userLogged: IUser;
  public idNotice: string;
  public configAllowed: boolean;
  public notice: INotice;
  public comments$: Observable<IComment[]>;
  public dialogConfig = new MatDialogConfig();
  public BTN_IMG_COMMENTS = 'assets/svg/comments.svg';
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public authSvc: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private logSrv: LogService,
    private userSrv: UserService,
    private noticeSrv: NoticeService,
    private pictureSrv: PictureService,
    private commentsSrv: CommentsService,
    ) {
      this.configAllowed = false;
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '600px';

      const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;

              this.configAllowed = this.canConfig(this.userLogged);
          });
          }
      });

    this.listOfObservers.push( subs1$ );
  }


  ngOnInit(): void {
    this.idNotice = this.route.snapshot.paramMap.get('id');
    this.comments$ = this.commentsSrv.getAllComments(this.idNotice);
    if ( this.idNotice ) {
      this.logSrv.info(`id asked ${this.idNotice}`);
      this.getDetails(this.idNotice);
    }
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  getDetails(idNotice: string): void {
    this.logSrv.info(`id asked ${idNotice}`);
    const subs1$ = this.noticeSrv.getOneNotice(idNotice)
      .subscribe((notice: INotice) => {
        this.notice = notice;
        this.seo.generateTags({
          title: `${notice.name} | Rincón de Soto`,
          description: notice.description,
          image: notice.imagePath,
        });
      });

    this.listOfObservers.push(subs1$);
  }

  public gotoList(): void {
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.idNotice}/editar`]);
  }

  public viewComments(nComments: number): void {

    const userRole = this.userLogged?.role ?? '';

    if ( nComments > 0 || ['SUPER', 'ADMIN', 'AUTOR'].includes(userRole)) {

        this.dialogConfig.width = '600px';
        this.dialogConfig.height = '600px';
        this.dialogConfig.data = {
          itemId: this.notice.id,
          itemName: this.notice.name,
          UserUid: this.userLogged?.uid ?? '',
          UserName: this.userLogged?.displayName ?? '',
          UserImage: this.userLogged?.photoURL ?? '',
          UserRole: userRole,
          EntityId: ( this.userLogged?.entityDefault?.id ?? '' ),
          EntityName: ( this.userLogged?.entityDefault?.name ?? '' ),
          EntityImage: ( this.userLogged?.entityDefault?.imagePath ?? '' ),
          commentType: CommentType.Notice,
        };

        const dialogRef = this.dialog.open(CommentsDialogComponent, this.dialogConfig);
    } else {
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'No hay comentarios en este aviso',
      //   text: 'Todos los comentarios son escritos por administradores de la agenda, evitando así spam o malos entendidos',
      //   confirmButtonColor: '#003A59',
      // });
    }
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url;
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      // case 'twitter':
      //   const title = `${this.notice.name} | Rincón de Soto`;
      //   window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(title), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
      //   break;

      // case 'facebook':
      //   window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
      //   break;

      case 'whatsapp':
        const titleWhatsapp = `${this.notice.name}`;
        window.open(`whatsapp://send?text=_Aviso en la Agenda Rinconera_%0a*${titleWhatsapp}*%0a${SHARED_URL}`);
        break;
    }
  }

  public viewImage(): void {
    window.open(this.notice.imagePath, '_blank');
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  private canConfig(userLogged: IUser): boolean {
    return this.userSrv.canConfig(userLogged, null, null);
  }
}
