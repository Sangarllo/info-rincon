import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Base } from '@models/base';
import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { AppointmentsService } from '@services/appointments.service';

@Component({
  selector: 'app-event-appointment-dialog',
  templateUrl: './event-appointment-dialog.component.html'
})
export class EventAppointmentDialogComponent implements OnInit, OnDestroy {
  title = 'Indica el horario de este evento';
  errorMessage = '';
  appointment: IAppointment;
  appointmentForm: FormGroup;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private appointmentSrv: AppointmentsService,
    public dialogRef: MatDialogRef<EventAppointmentDialogComponent>,
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
      });
    }
  }

  getDetails(idAppointment: string): void {

    if ( idAppointment === '0' ) { // TODO: No debería suceder
      this.title = 'Creación de una nueva entidad';
      this.appointment = Appointment.InitDefault(this.data.id);
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

      // this.listOfObservers.push(subs1$); TODO Remove
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
    Swal.fire({
      icon: 'warning',
      title: 'Datos no modificados',
      text: `Has cerrado la ventana sin guardar ningún cambio`,
    });
    this.dialogRef.close();
  }

  save(): void {
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `El horario ha sido guardado correctamente`,
    });

    this.appointmentForm.controls.dateIni.setValue(this.appointment.dateIni);
    this.appointmentForm.controls.dateEnd.setValue(this.appointment.dateEnd);

    this.dialogRef.close(this.appointmentForm.value);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
