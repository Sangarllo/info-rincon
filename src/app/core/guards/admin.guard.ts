import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import { SnackService } from '@services/snack.service';
import { UserService } from '@services/users.service';
import { UserRole } from '@models/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private userSrv: UserService,
    private snack: SnackService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const user = await this.afAuth.currentUser;
    console.log(`user: --> ${JSON.stringify(user)}`);
    if ( user ) {
        const role = await this.userSrv.getUserRole(user?.uid);
        const isAdmin = ( role === UserRole.Admin ) || ( role === UserRole.Super );
        if (!isAdmin) {
          this.snack.adminError();
        }
        return isAdmin;
    } else {
      return false;
    }
  }
}
