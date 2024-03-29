/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthService } from '@auth/auth.service';
import { UserService } from '@services/users.service';
import { AuditService } from '@services/audit.service';
import { AuditType } from '@models/audit';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  form: UntypedFormGroup;

  type: 'login' | 'signup' | 'reset' = 'login';
  loading = false;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: UntypedFormBuilder,
    private router: Router,
    private auditSrv: AuditService,
    private usersSrv: UserService,
    private authSrv: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.minLength(6), Validators.required]
      ],
      passwordConfirm: ['', []]
    });
  }

  changeType(val): void {
    this.type = val;
  }

  get isLogin(): boolean {
    return this.type === 'login';
  }

  get isSignup(): boolean {
    return this.type === 'signup';
  }

  get isPasswordReset(): boolean {
    return this.type === 'reset';
  }

  // eslint-disable-next-line
  get email() {
    return this.form.get('email');
  }

  // eslint-disable-next-line
  get password() {
    return this.form.get('password');
  }

  // eslint-disable-next-line
  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch(): boolean {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  // eslint-disable-next-line
  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.signInWithEmailAndPassword(email, password);
        if ( this.afAuth.user ) {
          const currentUser = await this.afAuth.currentUser;
          const description = `${currentUser.displayName} (${currentUser.email})`;
          this.auditSrv.addAuditItem(AuditType.LOGIN_EMAIL, currentUser, description);
          this.router.navigate([`admin`]);
        }
      }
      if (this.isSignup) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);

        if ( this.afAuth.user ) {
          const currentUser = await this.afAuth.currentUser;
          const description = `${currentUser.displayName} (${currentUser.email})`;
          this.auditSrv.addAuditItem(AuditType.LOGIN_PROVIDER, currentUser, description);
          this.usersSrv.createUserDataFromEmail(currentUser);
          this.authSrv.sendVerificationMail();
          this.router.navigate([`admin`]);
        }
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Revisa tu correo electrónico';
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
