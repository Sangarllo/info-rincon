/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { INotice, Notice } from '@models/notice';
import { IUser } from '@models/user';
import { UserRole } from '@models/user-role.enum';
import { INoticeComment } from '@models/comment';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';
import { UserService } from '@services/users.service';
import { CommentsService } from '@services/comments.service';

import { NoticeCommentsDialogComponent } from '@features/notices/notice-comments-dialog/notice-comments-dialog.component';

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
  public noticeComments$: Observable<INoticeComment[]>;
  public dialogConfig = new MatDialogConfig();
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public authSvc: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private logSrv: LogService,
    private userSrv: UserService,
    private noticeSrv: NoticeService,
    private commentsSrv: CommentsService,
    ) {
      this.configAllowed = false;
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '600px';

      this.matIconRegistry.addSvgIcon(
        `whatsapp`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/whatsapp.svg')
      );

      this.matIconRegistry.addSvgIcon(
        `facebook`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/facebook.svg')
      );

      this.matIconRegistry.addSvgIcon(
        `twitter`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/twitter.svg')
      );

      this.matIconRegistry.addSvgIcon(
        `comments`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/comments.svg')
      );

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
    this.noticeComments$ = this.commentsSrv.getAllNoticeComments(this.idNotice);
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
          image: notice.thumbnailImg ?? notice.imagePath,
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

  public viewComments(): void {

    this.dialogConfig.width = '600px';
    this.dialogConfig.height = '600px';
    this.dialogConfig.data = {
      noticeId: this.notice.id,
      UserUid: this.userLogged?.uid ?? '',
      UserRole: this.userLogged?.role ?? '',
    };

    const dialogRef = this.dialog.open(NoticeCommentsDialogComponent, this.dialogConfig);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url.substring(1);
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      case 'twitter':
        const title = `${this.notice.name} | Rincón de Soto`;
        window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(title), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'facebook':
        window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'whatsapp':
        window.open(`whatsapp://send?text=${SHARED_URL}`);
        break;
    }
  }

  public viewImage(): void {
    window.open(this.notice.imagePath, '_blank');
  }

  private canConfig(userLogged: IUser): boolean {
    return this.userSrv.canConfig(userLogged, null);
  }
}
