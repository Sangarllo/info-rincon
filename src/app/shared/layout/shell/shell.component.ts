import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuditService } from '@services/audit.service';
import { LogService } from '@services/log.service';
import { NoticeService } from '@services/notices.service';
import { AuditType } from 'src/app/core/models/audit';
import { INotice } from 'src/app/core/models/notice';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

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
        name: 'inicio'
      },
      {
        icon: 'privacy_tip',
        path: 'about',
        name: 'acerca de'
      },
      {
        icon: 'admin_panel_settings',
        path: 'admin',
        name: 'admin',
      },
      {
        icon: 'login',
        path: 'audit',
        name: 'auditoría',
      },
      {
        icon: 'add_circle_outline',
        path: 'eventos/new',
        name: 'crear evento',
      },
      {
        icon: 'calendar_today',
        path: 'calendario',
        name: 'agenda',
      },
      {
        icon: 'event',
        path: 'eventos',
        name: 'ver eventos',
      },
      {
        icon: 'campaign',
        path: 'avisos',
        name: 'ver avisos',
      },
      {
        icon: 'info',
        path: 'noticias',
        name: 'ver noticias',
      },
      {
        icon: 'account_circle',
        path: 'usuarios',
        name: 'ver usuarios',
      },
      {
        icon: 'group_work',
        path: 'entidades',
        name: 'ver entidades'
      },
      {
        icon: 'place',
        path: 'lugares',
        name: 'ver lugares'
      },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private auditSrv: AuditService,
    private logSrv: LogService,
    private noticeSrv: NoticeService,
    public afAuth: AngularFireAuth,
    ) {
        this.theAlertedNotice$ = this.noticeSrv
        .getTheAlertedNotice()
        .pipe(
          map( notices => { return notices[0] })
        );
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
}
