import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AppointmentsService } from '@services/appointments.service';
import { IEvent } from 'src/app/core/models/event';
import { IAppointment } from 'src/app/core/models/appointment';

@Component({
  selector: 'app-event-appointment-detail',
  templateUrl: './event-appointment-detail.component.html'
})
export class EventAppointmentDetailComponent implements OnInit {

  @Input() appointment: IAppointment;
  @Input() showImage: boolean;

  constructor(
    // private appointmentSrv: AppointmentsService
  ) { }

  ngOnInit(): void {
    // const idAppointment = this.appointmentId;
    // this.appointment$ = this.appointmentSrv.getOneAppointment(idAppointment);
  }
}
