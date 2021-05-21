import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';

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
export class ProfileComponent implements OnInit {

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
    this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.getCreatedEvents(uidUser);
      this.userData$ = this.userSrv.getOneUser(uidUser);
      this.getAudit(usr.uid);
    });
  }

  getAudit(uidUser: string): void {
    this.auditSrv.getAllAuditItemsByUser(uidUser)
    .subscribe( (auditItems: IAuditItem[]) => {
      this.auditItems = auditItems;
    });
  }

  getCreatedEvents(uidUser: string): void {
    this.eventSrv.getAllEventsByUser(uidUser)
    .subscribe( (eventItems: IBase[]) => {
      this.createdEventItems = eventItems;
    });
  }

}
