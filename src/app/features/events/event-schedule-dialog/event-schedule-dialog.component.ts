import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { IBase, Base, BaseType } from 'src/app/core/models/base';
import { IEvent } from 'src/app/core/models/event';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { AppointmentsService } from '@services/appointments.service';
import { Appointment, IAppointment } from 'src/app/core/models/appointment';
import { SCHEDULE_TYPE_DEFAULT } from 'src/app/core/models/shedule-type.enum';

@Component({
  selector: 'app-event-schedule-dialog',
  templateUrl: './event-schedule-dialog.component.html',
  styleUrls: ['./event-schedule-dialog.component.scss']
})
export class EventScheduleDialogComponent implements OnInit {

  title = 'Configura un nuevo acto para este evento';
  appointment: IAppointment;
  scheduleItemForm: FormGroup;
  orderId: string;
  imageSelected: string;
  dateIni: string;
  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private appointmentSrv: AppointmentsService,
    public dialogRef: MatDialogRef<EventScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: IEvent) {
  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {
    const eventId = this.event.id;
    if ( eventId ) {
      this.getDetails(eventId);
    }

    this.scheduleItemForm = this.fb.group({
      id: [ '', []],
      image: [ '', []],
      name: [ '', []],
      dateIni: [ '', []],
      timeIni: [ Appointment.HOUR_DEFAULT, []],
  });
  }

  getDetails(eventId: string): void {
    this.appointmentSrv.getOneAppointment(eventId)
      .subscribe((appointment: IAppointment) => {
          this.appointment = appointment;
          this.dateIni = this.appointment.dateIni;
          this.displayDetails();
      });
  }

  displayDetails(): void {

    const scheduleType = ( this.event.scheduleType ) ?? SCHEDULE_TYPE_DEFAULT;
    let name = '';

    if ( this.event.description === '' ) {
      this.orderId = (this.event.scheduleItems.length + 1).toString();
      this.title = `Configura un nuevo ${scheduleType} para este evento`;
      name = `${scheduleType} ${this.orderId}`;
      this.imageSelected = this.event.image;
    } else {
      this.orderId = this.event.description;
      this.title = `Edita el ${scheduleType} número ${this.orderId}`;
      name = this.event.scheduleItems.find( item => item.id === this.orderId ).name;
      this.imageSelected = this.event.scheduleItems.find( item => item.id === this.orderId ).image;
      const datetimeIni = this.event.scheduleItems.find( item => item.id === this.orderId ).description.split(' ');
      this.appointment.dateIni = datetimeIni[0];
      this.appointment.timeIni = datetimeIni[1];
    }

    this.scheduleItemForm.patchValue({
      id: this.orderId,
      image: this.imageSelected,
      name,
      dateIni: this.appointment.dateIni,
      timeIni: this.appointment.timeIni,
    });
  }

  onSelectedImage(path: string): void {
    this.imageSelected = path;
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.dateIni = newDate;
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    const timeIni = this.scheduleItemForm.controls.timeIni.value;
    const dateIniStr = `${this.dateIni} ${timeIni}`;

    const newBase: IBase = {
      id: this.orderId,
      active: true,
      name: this.scheduleItemForm.controls.name.value,
      image: this.imageSelected,
      baseType: BaseType.EVENT,
      description: dateIniStr
    };

    // this.utilsSrv.swalFire(SwalMessage.OK_CHANGES, 'x elementos');
    this.dialogRef.close(newBase);
  }
}
