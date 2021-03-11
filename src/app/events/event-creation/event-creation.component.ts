import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';

import { EventService } from '@services/events.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { EntityService } from '@services/entities.service';
import { LogService } from '@services/log.service';
import { UserService } from '@services/users.service';
import { Event } from '@models/event';
import { IBase, BaseType } from '@models/base';
import { IEntity } from '@models/entity';
import { IUser } from '@models/user';
import { UserRole } from '@models/user-role.enum';

import { EventNewBaseDialogComponent } from '@app/events/event-new-base-dialog/event-new-base-dialog.component';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.scss']
})
export class EventCreationComponent implements OnInit {

  public role: UserRole;
  public dialogConfig = new MatDialogConfig();

  constructor(
    public auth: AngularFireAuth,
    private userSrv: UserService,
    public dialog: MatDialog,
    private router: Router,
    private utilsSrv: UtilsService,
    private logSrv: LogService,
    private entitiesSrv: EntityService,
    private eventSrv: EventService
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userSrv.getOneUser(uidUser)
        .subscribe((user: IUser) => {
          this.role = user.role;
        });
    });
  }

  gotoNewEventFromScratch(): void {
    this.router.navigate([`eventos/0/editar`]);
  }

  openEntityDialog(): void {
    this.dialogConfig.data = BaseType.ENTITY;
    this.dialogConfig.width = '600px';
    this.dialogConfig.height = '600px';
    const dialogRef = this.dialog.open(EventNewBaseDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newBase: IBase) => {
      if ( newBase ) {
        this.entitiesSrv.getOneEntity(newBase.id)
        .subscribe((entity: IEntity) => {
          const newEvent = Event.InitDefault();
          this.eventSrv.addEventFromEntity(newEvent, entity, newBase.desc).then((eventId: string) => {
            this.logSrv.info(`EventId: ${eventId}`);
            this.router.navigate([`eventos/${eventId}/admin`]);
          });
        });
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

}
