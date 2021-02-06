import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';

import { UserService } from '@services/users.service';
import { IUser } from '@models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

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
