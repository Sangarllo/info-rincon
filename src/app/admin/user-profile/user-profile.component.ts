import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';

import { UserService } from '@services/users.service';
import { IUser } from '@models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public userData$: Observable<IUser>;

  constructor(
    public auth: AngularFireAuth,
    private userSrv: UserService
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userData$ = this.userSrv.getOneUser(uidUser);
    });
  }
}
