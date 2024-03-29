import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { LogService } from '@services/log.service';
import { AppointmentsService } from '@services/appointments.service';
import { IUser } from '@models/user';
import { UserRole } from '@models/user-role.enum';
import { Avatar } from '@models/image';

const USERS_COLLECTION = 'usuarios';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection!: AngularFirestoreCollection<IUser>;
  private userDoc!: AngularFirestoreDocument<IUser>;

  constructor(
    private afs: AngularFirestore,
    private logSrv: LogService,
    private appointmentSrv: AppointmentsService
  ) {
    this.userCollection = afs.collection(USERS_COLLECTION);
  }

  getAllUsers(): Observable<IUser[]> {
    this.userCollection = this.afs.collection<IUser>(
      USERS_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('displayName')
    );

    return this.userCollection.valueChanges()
      .pipe(
        map((users) => users.map(
          user => {
            user.role = user.role || UserRole.Lector;
            return { ...user };
          }))
      );
  }

  getAllAudit(): Observable<IUser[]> {
    this.userCollection = this.afs.collection<IUser>(
      USERS_COLLECTION,
      ref => ref.where('active', '==', true)
                .orderBy('lastLogin', 'desc')
    );

    return this.userCollection.valueChanges()
      .pipe(
        map((users) => users.map(
          user => {
            user.role = user.role || UserRole.Lector;
            return { ...user };
          }))
      );
  }

  getOneUser(uidUser: string): Observable<IUser | undefined> {
    if ( uidUser === undefined ) {
      return of(undefined);
    } else {
      return this.userCollection.doc(uidUser)
      .valueChanges({ uidField: 'uid' })
      .pipe(
        map(user => {
          user.role = user?.role ?? UserRole.Lector;
          return { ...user };
        })
      );
    }
  }


  getSeveralUsers(usersUid: string[]): Observable<IUser[]>{
    this.userCollection = this.afs.collection<IUser>(
      USERS_COLLECTION,
      ref => ref.where('uid', 'in', usersUid)
    );
    return this.userCollection.valueChanges();
  }


  async getUserRole(userUid): Promise<UserRole> {
    const user = await this.getOneUser(userUid).toPromise();
    return user.role;
  }

  // TODO When creating, perhaps existing as authenticated (check email)
  addUser(user: IUser): void {
    const uidUser = this.afs.createId();
    user.uid = uidUser;
    this.logSrv.info(`addUser: ${user.uid}`);
    this.logSrv.info(`addUser: ${JSON.stringify(user, null, 2)}`);
    this.userCollection.doc(user.uid).set(user);
  }

  updateUser(user: IUser): void {
    const uidUser = user.uid;
    this.userDoc = this.afs.doc<IUser>(`${USERS_COLLECTION}/${uidUser}`);
    this.userDoc.update(user);
  }

  deleteUser(user: IUser): void {
    const uidUser = user.uid;
    user.active = false;
    this.userDoc = this.afs.doc<IUser>(`${USERS_COLLECTION}/${uidUser}`);
    this.userDoc.update(user);
  }

  updateUserData(user: any): Promise<any> {
    const userRef: AngularFirestoreDocument<IUser> = this.afs.doc(
      `${USERS_COLLECTION}/${user.uid}`
    );

    // this.logSrv.info(`updateUserData 1: ${JSON.stringify(user)}`);

    // TODO: if role exists (or entities), don't update!
    const data: IUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
      active: user.active ?? true,
      lastLogin: this.appointmentSrv.getTimestamp(),
      favEvents: user.favEvents ?? [],
    };

    // this.logSrv.info(`updateUserData 2: ${JSON.stringify(data)}`);

    return userRef.set(data, { merge: true });
  }

  createUserDataFromEmail(user: any): Promise<any> {
    const userRef: AngularFirestoreDocument<IUser> = this.afs.doc(
      `${USERS_COLLECTION}/${user.uid}`
    );

    // this.logSrv.info(`updateUserData 1: ${JSON.stringify(user)}`);


    // TODO: if role exists (or entities), don't update!
    const data: IUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.email.split('@')[0],
      photoURL: Avatar.getRandom().path,
      active: true,
      lastLogin: this.appointmentSrv.getTimestamp(),
      favEvents: [],
      role: UserRole.Lector,
    };

    return userRef.set(data, { merge: true });
  }

  canConfig( userLogged: IUser, eventUsersArray?: string[], eventEntitiesArray?: string[]): boolean {

    // console.log(`userLogged: ${userLogged.uid}|${userLogged.displayName}|${userLogged.role}`);
    // console.log(`eventUsersArray: ${JSON.stringify(eventUsersArray)}`);
    // console.log(`eventEntitiesArray: ${JSON.stringify(eventEntitiesArray)}`);


    // A) SUPER || ADMIN
    if (
        ( userLogged.role === UserRole.Super ) ||
        ( userLogged.role === UserRole.Admin ) ){
      return true;
    }

    // B) AUTOR && event.eventUsersArray
    if ( eventUsersArray &&
        (userLogged.role === UserRole.Autor ) &&
        (eventUsersArray?.includes(userLogged.uid))
    ) {
      return true;
    }

    // C) AUTOR && event.eventEntitesArray
    if ( eventEntitiesArray &&
        userLogged.entitiesAdmin &&
        (userLogged.role === UserRole.Autor )
    ) {
      userLogged.entitiesAdmin.forEach( entityAdmin => {
        if ( eventEntitiesArray.includes( entityAdmin.id ) ) {
          return true;
        }
      });
    }

    return false;
  }
}
