import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable, Subscription } from 'rxjs';

import { UserService } from '@services/users.service';
import { IUser } from '@models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public userData$: Observable<IUser>;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public auth: AngularFireAuth,
    private userSrv: UserService
  ) { }

  ngOnInit(): void {
    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userData$ = this.userSrv.getOneUser(uidUser);
    });

    // this.listOfObservers.push(subs1$); TODO Remove
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
