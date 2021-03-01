import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { UserService } from '@services/users.service';
import { LogService } from '@services/log.service';
import { AuditService } from '@services/audit.service';
import { IUser, User } from '@models/user';
import { IAuditItem } from '@models/audit';
import { BaseType } from '@models/base';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  public user$: Observable<IUser | undefined> | null = null;
  public uidUser: string;
  public auditItems: IAuditItem[] = [];
  public baseTypeEntity: BaseType = BaseType.ENTITY;
  public baseTypeAudit: BaseType = BaseType.AUDIT;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private auditSrv: AuditService,
    private userSrv: UserService,
  ) { }

  ngOnInit(): void {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    if ( this.uidUser ) {
      this.logSrv.info(`uid asked ${this.uidUser}`);
      this.getDetails(this.uidUser);
      this.getAudit(this.uidUser);
    }
  }

  getDetails(uidUser: string): void {
    this.logSrv.info(`uid asked ${uidUser}`);
    this.user$ = this.userSrv.getOneUser(uidUser);
  }

  getAudit(uidUser: string): void {
    this.auditSrv.getAllAuditItemsByUser(uidUser)
    .subscribe( (auditItems: IAuditItem[]) => {
      this.auditItems = auditItems;
    });
  }

  public gotoList(): void {
    this.router.navigate([`/${User.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${User.PATH_URL}/${this.uidUser}/editar`]);
  }


}
