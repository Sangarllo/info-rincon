import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, Subscription } from 'rxjs';

import { UserService } from '@services/users.service';
import { AuditService } from '@services/audit.service';
import { EventService } from '@services/events.service';
import { BaseType, IBase } from '@models/base';
import { IUser, User } from '@models/user';
import { IAuditItem } from '@models/audit';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public userData$: Observable<IUser>;
  public uidUser: string;
  public auditItems: IAuditItem[] = [];
  public createdEventItems: IBase[] = [];
  public baseTypeEntity: BaseType = BaseType.ENTITY;
  public baseTypeAudit: BaseType = BaseType.AUDIT;
  public baseTypeEvent: BaseType = BaseType.EVENT;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private auditSrv: AuditService,
    private eventSrv: EventService,
    private userSrv: UserService
  ) { }

  ngOnInit(): void {
    const subs$ = this.auth.user.subscribe((usr) => {
      this.uidUser = usr?.uid;
      this.getCreatedEvents(this.uidUser);
      this.userData$ = this.userSrv.getOneUser(this.uidUser);
      this.getAudit(this.uidUser);
    });

    this.listOfObservers.push( subs$ );
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  public gotoEdition(): void {
    console.log('gotoEdition');
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/editar`]);
  }

  private getAudit(uidUser: string): void {
    const subs$ = this.auditSrv.getAllAuditItemsByUser(uidUser, 10)
      .subscribe( (auditItems: IAuditItem[]) => {
        this.auditItems = auditItems;
      });

    this.listOfObservers.push( subs$ );
  }

  private getCreatedEvents(uidUser: string): void {
    const subs$ = this.eventSrv.getAllEventsByUser(uidUser)
      .subscribe( (eventItems: IBase[]) => {
        this.createdEventItems = eventItems;
      });

    this.listOfObservers.push( subs$ );
  }

}
