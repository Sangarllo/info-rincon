import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';

import { AngularFireAuth } from '@angular/fire/auth';

import { SnackService } from '@services/snack.service';
import { UserRole } from '@models/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
    private snack: SnackService
  ) {}


  canActivate(): Observable<boolean> {
    return this.authSrv.user$.pipe(
      map(user => {
        if (!user) {
            this.router.navigate(['/login']);
            this.snack.authError();
            return false;
        }
        console.log(JSON.stringify(user));
        if (
          (user.role === UserRole.Admin) ||
          (user.role === UserRole.Super) ) {
            return true;
        } else {
          this.router.navigate(['/login']);
          this.snack.adminError();
          return false;
        }
      })
    );

  // async canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Promise<boolean> {

  //   const user = await this.afAuth.currentUser;
  //   console.log(`user: --> ${JSON.stringify(user)}`);
  //   if ( user ) {
  //       const role = await this.userSrv.getUserRole(user?.uid);
  //       const isAdmin = ( role === UserRole.Admin ) || ( role === UserRole.Super );
  //       if (!isAdmin) {
  //         this.snack.adminError();
  //       }
  //       return isAdmin;
  //   } else {
  //     return false;
  //   }
  }
}
