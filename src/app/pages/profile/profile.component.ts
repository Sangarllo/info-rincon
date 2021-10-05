import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable, Subscription } from 'rxjs';

import { UserService } from '@services/users.service';
import { AuditService } from '@services/audit.service';
import { EventService } from '@services/events.service';
import { BaseType, IBase } from '@models/base';
import { IUser } from '@models/user';
import { IAuditItem } from '@models/audit';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
  public userData$: Observable<IUser>;
  public auditItems: IAuditItem[] = [];
  public createdEventItems: IBase[] = [];
  public baseTypeEntity: BaseType = BaseType.ENTITY;
  public baseTypeAudit: BaseType = BaseType.AUDIT;
  public baseTypeEvent: BaseType = BaseType.EVENT;

  constructor(
    public auth: AngularFireAuth,
    private auditSrv: AuditService,
    private eventSrv: EventService,
    private userSrv: UserService
  ) { }

  ngOnInit(): void {
    const subs$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr?.uid;
      this.getCreatedEvents(uidUser);
      this.userData$ = this.userSrv.getOneUser(uidUser);
      this.getAudit(usr.uid);
    });

    this.listOfObservers.push( subs$ );
  }

  private getAudit(uidUser: string): void {
    const subs$ = this.auditSrv.getAllAuditItemsByUser(uidUser)
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

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
