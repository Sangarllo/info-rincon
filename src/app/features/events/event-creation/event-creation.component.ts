import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Subscription } from 'rxjs';

import { AuthService } from '@auth/auth.service';
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

import { EventNewBaseDialogComponent } from '@features/events/event-new-base-dialog/event-new-base-dialog.component';

@Component({
  selector: 'app-event-creation',
  templateUrl: './event-creation.component.html',
  styleUrls: ['./event-creation.component.scss']
})
export class EventCreationComponent implements OnInit, OnDestroy {

  public role: UserRole;
  public dialogConfig = new MatDialogConfig();
  public currentUser: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public auth: AngularFireAuth,
    private userSrv: UserService,
    public dialog: MatDialog,
    private router: Router,
    private utilsSrv: UtilsService,
    private authSrv: AuthService,
    private logSrv: LogService,
    private entitiesSrv: EntityService,
    private eventSrv: EventService
  ) {
    this.authSrv.user$.subscribe( (user: any) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr?.uid;
      const subs2$ = this.userSrv.getOneUser(uidUser)
        .subscribe((user: IUser) => {
          this.role = user.role;
        });

        this.listOfObservers.push(subs1$);
        this.listOfObservers.push(subs2$);
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
          this.eventSrv.addEventFromEntity(newEvent, entity, newBase.description).then((eventId: string) => {
            this.logSrv.info(`EventId: ${eventId}`);
            this.router.navigate([`eventos/${eventId}/config`]);
          });
        });
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  createEventFromEntity(entity: IEntity): void {
    const newEvent = Event.InitDefault();
    this.eventSrv.addEventFromEntity(newEvent, entity, entity.description).then((eventId: string) => {
      this.logSrv.info(`EventId: ${eventId}`);
      this.router.navigate([`eventos/${eventId}/config`]);
    });
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
