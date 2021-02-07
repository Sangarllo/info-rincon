import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { UserService } from '@services/users.service';
import { IUser } from '@models/user';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private usersSrv: UserService ) {
  }

  @HostListener('click')
  // tslint:disable-next-line: typedef
  async onclick() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if ( this.afAuth.user ) {
      this.afAuth.user
        .subscribe( (user: firebase.User) => {
          // console.log(`logged as ${JSON.stringify(user)}`);
          this.usersSrv.updateUserData(user);
          this.router.navigate([`admin`]);
        })
    }
  }
}
