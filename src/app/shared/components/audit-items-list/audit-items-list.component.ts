import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuditItem, AuditType, IAuditItem } from '@models/audit';
import { IBase, BaseType } from '@models/base';
import { IUser } from '@models/user';
import { LogService } from '@services/log.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'sh-audit-items-list',
  templateUrl: './audit-items-list.component.html',
  styleUrls: ['./audit-items-list.component.scss']

})
export class AuditItemsListComponent implements OnInit {

  @Input() items: IBase[];

  auditItems: AuditItem[];

  constructor(
    private router: Router,
    private logSrv: LogService,
    private userSrv: UserService,
  ) {
  }

  ngOnInit(): void {
    const usersUids = this.getUsers();
    this.userSrv.getSeveralUsers(usersUids)
      .subscribe((users: IUser[]) => {
        this.auditItems = [];

        for (const item of this.items) {

          console.log(`item: ${JSON.stringify(item)}`);

          const user: IUser = users.find(u => u.uid === item.userId);
          const auditItem: IAuditItem = {
            ...item,
            userId: user.uid,
            userName: user.displayName,
            userImg: user.photoURL,
            auditType: item.auditType,
            description: AuditItem.getEmoji(item.auditType),
          };

          this.auditItems.push(auditItem);

          console.log(`auditItem: ${JSON.stringify(auditItem)}`);
        }
      });
  }

  private getUsers(): string[] {
    const flags = {};
    const newUsers = [];
    let index;
    for (index = 0; index < this.items.length; ++index) {
        const item = this.items[index];
        if (!flags[item.userId]) {
            flags[item.userId] = true;
            newUsers.push(item.userId);
        }
    };
    return newUsers;
  }

}
