import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public userRole: string;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public afAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const subs1$ = this.authSrv.user$.subscribe(user => {
      if (user) {
        this.userRole = user.role;
      }
    });

    // this.listOfObservers.push(subs1$); TODO Remove
  }

  gotoHome(): void {
    this.router.navigate(['/home']);
  }

  gotoAdmin(): void {
    this.router.navigate(['/admin']);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
