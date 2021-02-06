import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router ) {
  }

  @HostListener('click')
  // tslint:disable-next-line: typedef
  async onclick() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if ( this.afAuth.user ) {
      this.router.navigate([`admin`]);
    }
  }
}
