import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { UserService } from '@services/users.service';
import { AuditService } from '@services/audit.service';
import { AuditType } from '@models/audit';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private auditSrv: AuditService,
    private usersSrv: UserService ) {
  }

  @HostListener('click')
  // eslint-disable-next-line
  async onclick() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if ( this.afAuth.user ) {
      const currentUser = await this.afAuth.currentUser;
      const desc = `${currentUser.displayName} (${currentUser.email})`;
      this.auditSrv.addAuditItem(AuditType.LOGIN_PROVIDER, currentUser, desc);
      this.usersSrv.updateUserData(currentUser);
      this.router.navigate([`admin`]);
    }
  }
}
