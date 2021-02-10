import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { Base, IBase, BaseType } from '@models/base';
import { IAppointment } from '@models/appointment';
import { IEvent, Event } from '@models/event';
import { IUser } from '@models/user';
import { EventService } from '@services/events.service';
import { AppointmentsService } from '@services/appointments.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { AuditType } from '@models/audit';

import { EventBasicDialogComponent } from '@app/events/event-basic-dialog/event-basic-dialog.component';
import { EventStatusDialogComponent } from '@app/events/event-status-dialog/event-status-dialog.component';
import { EventAppointmentDialogComponent } from '@app/events/event-appointment-dialog/event-appointment-dialog.component';
import { EventImageDialogComponent } from '@app/events/event-image-dialog/event-image-dialog.component';
import { EventNewBaseDialogComponent } from '@app/events/event-new-base-dialog/event-new-base-dialog.component';
import { EventScheduleDialogComponent } from '@app/events/event-schedule-dialog/event-schedule-dialog.component';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.scss']
})
export class EventAdminComponent implements OnInit {

  private currentUser: IUser;
  public event: IEvent;
  public idEvent: string;
  public appointment$: Observable<IAppointment>;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private utilsSrv: UtilsService,
    private eventSrv: EventService,
    private appointmentSrv: AppointmentsService
  ) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';
  }

  ngOnInit(): void {

    this.authSrv.currentUser$.subscribe( (user: any) => {
      this.currentUser = user;
    });

    this.idEvent = this.route.snapshot.paramMap.get('id');
    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);
    if ( this.idEvent ) {
      this.getDetails(this.idEvent);
    }
  }

  getDetails(idEvent: string): void {
    this.eventSrv.getOneEvent(idEvent)
    .subscribe((event: IEvent) => {
      this.event = event;
    });
  }

  public gotoList(): void {
    this.router.navigate([`/${Event.PATH_URL}`]);
  }

  public gotoItemView(): void {
    // TODO: in a modal dialog?
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}`]);
  }

  openEventBasicDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventBasicDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      if ( eventDialog ) {
        this.event.name = eventDialog.name;
        this.event.description = eventDialog.description;
        this.event.categories = eventDialog.categories;
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO);
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEventImageDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventImageDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      if ( eventDialog ) {
        this.event.image = eventDialog.image;
        this.event.images = eventDialog.images;
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Modificada imagen');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEventStatusDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventStatusDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      if ( eventDialog ) {
        this.event.status = eventDialog.status;
        this.event.active = eventDialog.active;
        this.event.focused = eventDialog.focused;
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_STATUS );
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openPlaceDialog(): void {
    this.dialogConfig.data = BaseType.PLACE;
    const dialogRef = this.dialog.open(EventNewBaseDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newBase: IBase) => {
      if ( newBase ) {
        this.event.placeItems.push(newBase);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Añadida ubicacíon');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEntityDialog(): void {
    this.dialogConfig.data = BaseType.ENTITY;
    const dialogRef = this.dialog.open(EventNewBaseDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newBase: IBase) => {
      if ( newBase ) {
        this.event.entityItems.push(newBase);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Añadida entidad');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openAppointmentDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventAppointmentDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newAppointment: IAppointment) => {
      if ( newAppointment ) {
        this.appointmentSrv.updateAppointment(newAppointment);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openScheduleDialog(scheduleItemId: string): void {

    const backupDesc = this.event.description;
    if ( scheduleItemId === '' ) {
      this.event.description = ''; // New Item
    } else {
      this.event.description = scheduleItemId; // Edit existing item
    }

    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventScheduleDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((scheduleItem: IBase) => {

      this.event.description = backupDesc;
      if ( scheduleItem ) {

        console.log(`afterClosed -> ${JSON.stringify(scheduleItem)}`);
        const index = this.event.scheduleItems.findIndex(item => item.id === scheduleItem.id);
        console.log(`afterClosed 2 -> ${index}`);
        if ( index < 0 ) { // Adding new ScheduleItem
          this.event.scheduleItems.push(scheduleItem);
        } else {
          this.event.scheduleItems[index] = scheduleItem;
        }

        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');

      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  changeOrderScheduleItem(base: IBase): void {
    console.log(`changeOrderScheduleItem ${base.id}`);
    const baseId =  base.id;
    const input = baseId.split('|');
    const id1 = input[0];
    const change = input[1];
    let id2: string;
    this.event.scheduleItems.find(item => item.id === baseId).id = id1;

    if ( change === '+1' ) {
      console.log(`bajando`);
      id2 = (+id1 + 1).toString();
    } else {
      console.log(`subiendo`);
      id2 = (+id1 - 1).toString();
    }

    this.event.scheduleItems.find(item => item.id === id1).id = 'NEW';
    this.event.scheduleItems.find(item => item.id === id2).id = id1;
    this.event.scheduleItems.find(item => item.id === 'NEW').id = id2;

    this.event.scheduleItems = this.event.scheduleItems.sort((item1: IBase, item2: IBase) => {
      if (item1.id > item2.id) { return 1; }
      if (item1.id < item2.id) { return -1; }
      return 0;
    });

    // this.event.scheduleItems = this.event.scheduleItems.sort(this.comparar);

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  addScheduleItem(base: IBase): void {
    console.log(`addScheduleItem: ${JSON.stringify(base)}`);
    this.event.scheduleItems.find(item => item.id === base.id).active = true;
    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  deleteScheduleItem(base: IBase): void {
    console.log(`deleteScheduleItem: ${JSON.stringify(base)}`);
    this.event.scheduleItems.find(item => item.id === base.id).active = false;
    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  editScheduleItem(base: IBase): void {
    console.log(`editScheduleItem: ${JSON.stringify(base)}`);
    this.openScheduleDialog(base.id);
  }
}
