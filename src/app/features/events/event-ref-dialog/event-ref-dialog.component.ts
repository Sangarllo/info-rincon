import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Observable, Subscription } from 'rxjs';

import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { AppointmentsService } from '@services/appointments.service';
import { IEventRef } from '@models/event-ref';

@Component({
  selector: 'app-event-ref-dialog',
  templateUrl: './event-ref-dialog.component.html',
  styleUrls: ['./event-ref-dialog.component.scss']
})
export class EventRefDialogComponent implements OnInit, OnDestroy {

  title = 'Añade un nuevo evento de este superevento';
  appointment: IAppointment;
  eventRefForm: FormGroup;
  thisScheduleId: string;
  orderId: number;
  imageIdSelected: string;
  imagePathSelected: string;
  dateStr: string;
  timeStr: string;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private appointmentSrv: AppointmentsService,
    public dialogRef: MatDialogRef<EventRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: IEvent) {
  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {

      // console.log(`EventScheduleDialogComponent.ngOnInit(${this.event.extra})`);

      const eventId = this.event.id;
      if ( eventId ) {
        this.getDetails(eventId);
      }

      this.eventRefForm = this.fb.group({
          name: [ '', [Validators.required]],
          dateStr: [ '', []],
          timeStr: [ Appointment.HOUR_DEFAULT, []],
          eventId: [ '', []],
      });
  }


  getDetails(eventId: string): void {
    const subs1$ = this.appointmentSrv.getOneAppointment(eventId)
      .subscribe((appointment: IAppointment) => {
          this.appointment = appointment;
          this.displayDetails();
      });

    this.listOfObservers.push(subs1$);
  }

  displayDetails(): void {

    const name = '';

    this.eventRefForm.patchValue({
      name,
      dateStr: this.appointment.dateIni,
      timeStr: this.appointment.timeIni,
      eventId: '',
    });
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.dateStr = newDate;
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    const name = this.eventRefForm.controls.name.value;
    const timeStr = this.eventRefForm.controls.timeStr.value;
    const dateStr = this.eventRefForm.controls.dateStr.value;
    const eventId = this.eventRefForm.controls.eventId.value;

    const newEventRef: IEventRef = {
      id: this.utilsSrv.getGUID(),
      name,
      dateStr,
      timeStr,
      eventId,
    };

    this.dialogRef.close(newEventRef);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
