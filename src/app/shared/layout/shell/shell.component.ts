import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';
import { AuditType } from '@models/audit';
import { INotice } from '@models/notice';
import { IUser } from '@models/user';
import { AuditService } from '@services/audit.service';
import { LogService } from '@services/log.service';
import { NoticeService } from '@services/notices.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnDestroy {

  public userLogged: IUser;
  public theAlertedNotice$: Observable<INotice>;
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public LINKS = [
      {
        icon: 'home',
        path: 'home',
        name: 'inicio',
        roles: [ 'LECTOR', 'AUTOR', 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'admin_panel_settings',
        path: 'admin',
        name: 'admin',
        roles: [ 'LECTOR', 'AUTOR', 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'login',
        path: 'audit',
        name: 'auditoría',
        roles: [ 'SUPER' ],
      },
      {
        icon: 'add_circle_outline',
        path: 'eventos/new',
        name: 'crear evento',
        roles: [ 'AUTOR', 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'calendar_today',
        path: 'calendario',
        name: 'agenda',
        roles: [ 'LECTOR', 'AUTOR', 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'event',
        path: 'eventos',
        name: 'ver eventos',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'campaign',
        path: 'avisos',
        name: 'ver avisos',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'info',
        path: 'noticias',
        name: 'ver noticias',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'account_circle',
        path: 'usuarios',
        name: 'ver usuarios',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'group_work',
        path: 'entidades',
        name: 'ver entidades',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'place',
        path: 'lugares',
        name: 'ver lugares',
        roles: [ 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'contact_support',
        path: 'faq',
        name: 'faq',
        roles: [ 'LECTOR', 'AUTOR', 'ADMIN', 'SUPER' ],
      },
      {
        icon: 'privacy_tip',
        path: 'about',
        name: 'acerca de',
        roles: [ 'LECTOR', 'AUTOR', 'ADMIN', 'SUPER' ],
      },
];

  private listOfObservers: Array<Subscription> = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private auditSrv: AuditService,
    private logSrv: LogService,
    private noticeSrv: NoticeService,
    private userSrv: UserService,
    public authSvc: AuthService,
    public afAuth: AngularFireAuth,
    ) {
        this.theAlertedNotice$ = this.noticeSrv
        .getTheAlertedNotice()
        .pipe(
          map( notices => notices[0] )
        );

        const subs1$ = this.authSvc.afAuth.user
        .subscribe( (user: any) => {
            if ( user?.uid ) {
              this.userSrv.getOneUser(user.uid)
                  .subscribe( (userLogged: any ) => {
                      this.userLogged = userLogged;
                      // console.log(`userLoggedFav: ${userLogged.favEvents?.length}`);
                  });
            }
        });

        this.listOfObservers.push( subs1$ );
  }

  gotoFavs(): void {
    this.router.navigate([`/eventos/favoritos`]);
  }

  async onLogout(): Promise<void> {
    try {
      const currentUser = await this.afAuth.currentUser;
      this.auditSrv.addAuditItem(AuditType.LOGOUT, currentUser);
      await this.afAuth.signOut();
      this.router.navigate(['/home']);
    } catch (error) {
      this.logSrv.info(error);
    }
  }

  public showAlert(notice: INotice): void {
    this.router.navigate([`/avisos/${notice.id}`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
