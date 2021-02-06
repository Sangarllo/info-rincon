import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/shared/auth/auth.service';
import { IUser } from '@models/user';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public user$: Observable<IUser> = this.authSvc.afAuth.user;

  constructor(
    public authSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
