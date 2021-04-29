import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/core/auth/auth.service';
import { UserRole } from 'src/app/core/models/user-role.enum';
import { IEvent, Event } from 'src/app/core/models/event';
import { IUser } from 'src/app/core/models/user';
import { IBase, BaseType } from 'src/app/core/models/base';
import { IEntity } from 'src/app/core/models/entity';
import { EventService } from '@services/events.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { EntityService } from '@services/entities.service';
import { LogService } from '@services/log.service';

import { EventNewBaseDialogComponent } from '@features/events/event-new-base-dialog/event-new-base-dialog.component';

@Component({
  selector: 'app-role-options',
  templateUrl: './role-options.component.html',
  styleUrls: ['./role-options.component.scss']
})
export class RoleOptionsComponent {

  @Input() role: UserRole;

  public dialogConfig = new MatDialogConfig();
  private currentUser: IUser;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private utilsSrv: UtilsService,
    private authSrv: AuthService,
    private logSrv: LogService,
    private entitiesSrv: EntityService,
    private eventSrv: EventService
  ) {
    this.authSrv.currentUser$.subscribe( (user: any) => {
      this.currentUser = user;
    });
  }

  gotoNewEventFromScratch(): void {
    this.router.navigate([`eventos/0/editar`]);
  }

  gotoUsersDashboard(): void {
    this.router.navigate([`usuarios`]);
  }

  gotoEntitiesDashboard(): void {
    this.router.navigate([`entidades`]);
  }

  gotoPlacesDashboard(): void {
    this.router.navigate([`lugares`]);
  }

  gotoEventsDashboard(): void {
    this.router.navigate([`eventos`]);
  }

  gotoNoticesDashboard(): void {
    this.router.navigate([`avisos`]);
  }

  gotoNewsDashboard(): void {
    this.router.navigate([`noticias`]);
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
