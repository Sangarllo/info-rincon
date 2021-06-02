import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { Base, IBase, BaseType } from '@models/base';
import { IAppointment, Appointment } from '@models/appointment';
import { IEvent, Event } from '@models/event';
import { IUser } from '@models/user';
import { AuditType } from '@models/audit';
import { EventService } from '@services/events.service';
import { AppointmentsService } from '@services/appointments.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';


import { EventBasicDialogComponent } from '@features/events/event-basic-dialog/event-basic-dialog.component';
import { EventStatusDialogComponent } from '@features/events/event-status-dialog/event-status-dialog.component';
import { EventAppointmentDialogComponent } from '@features/events/event-appointment-dialog/event-appointment-dialog.component';
import { EventImageDialogComponent } from '@features/events/event-image-dialog/event-image-dialog.component';
import { EventNewBaseDialogComponent } from '@features/events/event-new-base-dialog/event-new-base-dialog.component';
import { EventScheduleDialogComponent } from '@features/events/event-schedule-dialog/event-schedule-dialog.component';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.scss']
})
export class EventAdminComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  private listOfObservers: Array<Subscription> = [];
  public event: IEvent;
  public idEvent: string;
  public appointment$: Observable<IAppointment>;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  public dialogConfig = new MatDialogConfig();
  public baseType = BaseType.EVENT;
  private currentUser: IUser;
  shownAsAWholeControl = new FormControl();

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private logSrv: LogService,
    private utilsSrv: UtilsService,
    private eventSrv: EventService,
    private appointmentSrv: AppointmentsService
  ) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';
  }

  ngOnInit(): void {

    const subs1$ = this.authSrv.currentUser$.subscribe( (user: any) => {
      this.currentUser = user;
    });

    this.idEvent = this.route.snapshot.paramMap.get('id');
    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);
    if ( this.idEvent ) {
      this.getDetails(this.idEvent);
    }

    this.listOfObservers.push(subs1$);
  }

  getDetails(idEvent: string): void {
    this.eventSrv.getOneEvent(idEvent)
    .subscribe((event: IEvent) => {
      this.event = event;
      this.shownAsAWholeControl.setValue(String(this.event.shownAsAWhole));
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

    if ( scheduleItemId === '' ) {
      this.event.extra = ''; // New Item
    } else {
      this.event.extra = scheduleItemId; // Edit existing item
    }

    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventScheduleDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((scheduleItem: IBase) => {

      if ( scheduleItem ) {

        const index = this.event.scheduleItems.findIndex(item => item.id === scheduleItem.id);
        if ( index < 0 ) { // Adding new ScheduleItem and appointment
          this.event.scheduleItems.push(scheduleItem);
          this.appointmentSrv.addScheduleAppointment(
            scheduleItem,
            !this.event.shownAsAWhole
          );
        } else {
          this.event.scheduleItems[index] = scheduleItem;
          const scheduleAppointment = Appointment.InitFromSchedule(scheduleItem, !this.event.shownAsAWhole);
          this.appointmentSrv.updateAppointment(scheduleAppointment);
        }

        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');

      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  changeOrderScheduleItem(base: IBase): void {
    this.logSrv.info(`changeOrderScheduleItem ${base.id}`);
    const baseId =  base.id;
    const input = baseId.split('|');
    const id1 = input[0];
    const change = +input[1];
    const order1 = this.event.scheduleItems.find(item => item.id === baseId).order;
    const order2 = order1 + change;
    const id2 = this.event.scheduleItems.find(item => item.order === order2).id;

    // Reestablish
    this.event.scheduleItems.find(item => item.id === baseId).id = id1;

    // Exchange
    this.event.scheduleItems.find(item => item.id === id1).order = order2;
    this.event.scheduleItems.find(item => item.id === id2).order = order1;

    // Order
    this.event.scheduleItems = this.event.scheduleItems.sort((item1: IBase, item2: IBase) => {
      if (item1.order > item2.order) { return 1; }
      if (item1.order < item2.order) { return -1; }
      return 0;
    });

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  addScheduleItem(base: IBase): void {
    this.logSrv.info(`addScheduleItem: ${JSON.stringify(base)}`);
    this.event.scheduleItems.find(item => item.id === base.id).active = true;
    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  deleteScheduleItem(base: IBase): void {
    this.logSrv.info(`deleteScheduleItem: ${JSON.stringify(base)}`);
    this.event.scheduleItems.find(item => item.id === base.id).active = false;
    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
  }

  editScheduleItem(base: IBase): void {
    this.logSrv.info(`editScheduleItem: ${JSON.stringify(base)}`);
    this.openScheduleDialog(base.id);
  }

  deleteForeverScheduleItem(base: IBase): void {
    const scheduleDeletedId = base.id;
    this.event.scheduleItems = this.event.scheduleItems.filter(item => item.id !== scheduleDeletedId);

    if ( this.event.scheduleItems.length === 0 ) {
      this.onValShownAsAWholeChange('true');
    } else {
      this.event.scheduleItems.forEach( item => {
        if ( +item.id > +scheduleDeletedId ) {
          item.id = String(+item.id - 1);
        };
      });
    }

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
    this.appointmentSrv.deleteAppointment(scheduleDeletedId);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  onValShownAsAWholeChange(shownAsAWhole: string){
    this.event.shownAsAWhole = ( shownAsAWhole === 'true' ) ? true : false;
    this.appointmentSrv.enableAppointment(this.event.id, this.event.shownAsAWhole);
    this.event.scheduleItems.forEach(item => {
      this.appointmentSrv.enableAppointment(item.id, !this.event.shownAsAWhole)
    });
  }
}
