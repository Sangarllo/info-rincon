import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { IAppointment } from '@models/appointment';
import { IEvent, Event } from '@models/event';
import { EventService } from '@services/events.service';
import { AppointmentsService } from '@services/appointments.service';

@Component({
  selector: 'app-event-wiki',
  templateUrl: './event-wiki.component.html',
  styleUrls: ['./event-wiki.component.scss']
})
export class EventWikiComponent implements OnInit {

  private listOfObservers: Array<Subscription> = [];
  public event: IEvent;
  public idEvent: string;
  public appointment$: Observable<IAppointment>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentSrv: AppointmentsService,
    private eventSrv: EventService,

  ) { }

  ngOnInit(): void {
    this.idEvent = this.route.snapshot.paramMap.get('id');
    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);
    if ( this.idEvent ) {
      this.getDetails(this.idEvent);
    }
  }

  getDetails(idEvent: string): void {
    const subs2$ = this.eventSrv.getOneEvent(idEvent)
      .subscribe((event: IEvent) => {
          this.event = event;
      });

    this.listOfObservers.push( subs2$ );
  }

}
