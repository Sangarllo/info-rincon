import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RoleValidator } from '@auth/helpers/roleValidator';
import { IUser } from '@models/user';
import { UserService } from '@services/users.service';
import { LogService } from '@services/log.service';

const USERS_COLLECTION = 'usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService extends RoleValidator {
  public currentUser$: Observable<firebase.User>;
  public user$: Observable<IUser>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private logSrv: LogService,
    private userSrv: UserService,
  ) {
    super();
    this.currentUser$ = this.afAuth.user;
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<IUser>(`${USERS_COLLECTION}/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }



  async login(email: string, password: string): Promise<IUser> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.userSrv.updateUserData(user);
      return user;
    } catch (error) {
      this.logSrv.info(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      this.logSrv.info(error);
    }
  }

  async sendVerificationMail() {
    (await this.afAuth.currentUser).sendEmailVerification().then(() => {
        console.log('email sent');
    });
}
}
