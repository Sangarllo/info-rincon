import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Subscription } from 'rxjs';

import { Base } from '@models/base';
import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { AppointmentType, APPOINTMENT_ICON_TYPES, IAppointmentTypeIcon } from '@models/appointment-type';
import { AppointmentsService } from '@services/appointments.service';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-event-appointment-dialog',
  templateUrl: './event-appointment-dialog.component.html',
})
export class EventAppointmentDialogComponent implements OnInit, OnDestroy {
  title = 'Indica el horario de este evento';
  errorMessage = '';
  appointment: IAppointment;
  appointmentForm: UntypedFormGroup;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  readonly APPOINTMENT_TYPES: IAppointmentTypeIcon[] = APPOINTMENT_ICON_TYPES;

  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EventAppointmentDialogComponent>,
    private appointmentSrv: AppointmentsService,
    private utilsSvc: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: IEvent) {
  }

  ngOnInit(): void {

    const idAppointment = this.data.appointmentId;
    if ( idAppointment ) {
        this.getDetails(idAppointment);

        this.appointmentForm = this.fb.group({
          id: [ idAppointment, []],
          allDay: [ true, []],
          dateIni: [ '', []],
          timeIni: [ '', []],
          withEnd: [ false, []],
          dateEnd: [ '', []],
          timeEnd: [ '', []],
          description: [ '', []],
          appointmentType: [ '', []],
        });
    }
  }

  getDetails(idAppointment: string): void {

    if ( idAppointment === '0' ) { // TODO: No debería suceder
      this.title = 'Creación de un nuevo horario';
      this.appointment = Appointment.InitDefault(this.data.id, AppointmentType.EVENT_DATE);
    } else {
      const subs1$ = this.appointmentSrv.getOneAppointment(idAppointment)
      .subscribe({
        next: (appointment: IAppointment | undefined) => {
          this.appointment = appointment;
          this.displayAppointment();
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });

      this.listOfObservers.push(subs1$);
    }
  }

  displayAppointment(): void {

    if (this.appointmentForm) {
      this.appointmentForm.reset();
    }

    // Update the data on the form
    this.appointmentForm.patchValue({
      id: this.appointment.id,
      allDay: this.appointment.allDay,
      dateIni: this.appointment.dateIni,
      timeIni: this.appointment.timeIni,
      withEnd: this.appointment.withEnd,
      dateEnd: this.appointment.dateEnd,
      timeEnd: this.appointment.timeEnd,
      description: this.appointment.description,
    });

    this.appointmentForm.controls.id.setValue(this.appointment.id);
  }

  onAppointmentTypeChange(appointmentType: IAppointmentTypeIcon){
      console.log(`appointmentType: ${JSON.stringify(appointmentType.type)}`);
      this.appointmentForm.controls.appointmentType.setValue(appointmentType.type);

      switch (appointmentType.type) {
          case AppointmentType.EVENT_DATE:
              this.appointmentForm.controls.allDay.setValue(true);
              this.appointmentForm.controls.timeIni.setValue(Appointment.HOUR_DEFAULT);
              this.appointmentForm.controls.withEnd.setValue(false);
              this.appointmentForm.controls.timeEnd.setValue(Appointment.HOUR_DEFAULT);
              break;

          case AppointmentType.EVENT_DATETIME:
              this.appointmentForm.controls.allDay.setValue(false);
              this.appointmentForm.controls.withEnd.setValue(false);
              this.appointmentForm.controls.timeEnd.setValue(Appointment.HOUR_DEFAULT);
              break;

          case AppointmentType.RANGE_DATES:
              this.appointmentForm.controls.allDay.setValue(true);
              this.appointmentForm.controls.withEnd.setValue(true);
              this.appointmentForm.controls.dateEnd.setValue(
                  this.appointmentForm.controls.dateIni.value
              );
              this.appointmentForm.controls.timeEnd.setValue(Appointment.HOUR_DEFAULT);
              break;

          case AppointmentType.DEADLINE:
              this.appointmentForm.controls.allDay.setValue(false);
              this.appointmentForm.controls.withEnd.setValue(false);
              this.appointmentForm.controls.timeEnd.setValue(Appointment.HOUR_DEFAULT);
              break;

          case AppointmentType.PROVISIONAL:
              this.appointmentForm.controls.allDay.setValue(true);
              this.appointmentForm.controls.timeIni.setValue(Appointment.HOUR_DEFAULT);
              this.appointmentForm.controls.withEnd.setValue(false);
              this.appointmentForm.controls.timeEnd.setValue(Appointment.HOUR_DEFAULT);
              break;
      }

      this.appointment.timeIni = this.appointmentForm.controls.timeIni.value;
      this.appointment.allDay = this.appointmentForm.controls.allDay.value;

      this.updateTemporalDesc();
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.appointment.dateIni = newDate;
    this.updateTemporalDesc();
  }

  onDateEndChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.appointment.dateEnd = newDate;
    this.updateTemporalDesc();
  }

  public onInputChange(controlName: string): void {
    switch (controlName) {

      case 'allDay':
        this.appointment.allDay = this.appointmentForm.controls.allDay.value;
        break;

      case 'withEnd':
        this.appointment.withEnd = this.appointmentForm.controls.withEnd.value;
        break;

      case 'timeIni':
        this.appointment.timeIni = this.appointmentForm.controls.timeIni.value;
        break;

      case 'timeEnd':
        this.appointment.timeEnd = this.appointmentForm.controls.timeEnd.value;
        break;

      default:
        break;
    }

    this.updateTemporalDesc();
  }

  public updateTemporalDesc(): void {

    this.appointment.description = Appointment.computeDesc(this.appointment);
    this.appointmentForm.controls.description.setValue(this.appointment.description);
  }

  onNoClick(): void {
    this.utilsSvc.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, 'el horario');

    this.appointmentForm.controls.dateIni.setValue(this.appointment.dateIni);
    this.appointmentForm.controls.dateEnd.setValue(this.appointment.dateEnd);

    this.dialogRef.close(this.appointmentForm.value);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
