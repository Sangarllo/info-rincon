import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public LINKS = [
      {
        icon: 'home',
        path: 'home',
      },
      {
        icon: 'admin_panel_settings',
        path: 'admin',
      },
      {
        icon: 'calendar_today',
        path: 'calendario',
      },
      {
        icon: 'event',
        path: 'eventos',
      },
      {
        icon: 'campaign',
        path: 'avisos',
      },
      {
        icon: 'info',
        path: 'noticias',
      },
      {
        icon: 'account_circle',
        path: 'usuarios',
      },
      {
        icon: 'group_work',
        path: 'entidades',
      },
      {
        icon: 'place',
        path: 'lugares',
      },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public afAuth: AngularFireAuth) {
  }

  async onLogout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/usuarios/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
