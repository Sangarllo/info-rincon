import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { SeoService } from '@services/seo.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Base } from 'src/app/core/models/base';
import { IEvent, Event } from 'src/app/core/models/event';
import { IUser } from 'src/app/core/models/user';
import { IAppointment } from 'src/app/core/models/appointment';
import { UserRole } from 'src/app/core/models/user-role.enum';
import { EventService } from '@services/events.service';
import { UserService } from '@services/users.service';
import { AppointmentsService } from '@services/appointments.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  public userLogged: IUser;
  public adminAllowed: boolean;
  public event: IEvent;
  public idEvent: string;
  public appointment$: Observable<IAppointment>;
  readonly SECTION_BLANK: Base = Base.InitDefault();

  constructor(
    public authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private userSrv: UserService,
    private appointmentSrv: AppointmentsService,
    private eventSrv: EventService,
  ) {
    this.adminAllowed = false;
    this.authSvc.afAuth.user.subscribe( (user: any) => {
      this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
        this.userLogged = userLogged;
        this.adminAllowed = this.canAdmin(this.userLogged);
      });
    });
  }

  ngOnInit(): void {
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
      this.seo.generateTags({
        title: `${event.name} | Rincón de Soto`,
        description: event.description,
        image: event.image,
      });
    });
  }

  public adminItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}/admin`]);
  }

  private canAdmin(userLogged: IUser): boolean {
    if ( userLogged.role !== UserRole.Lector) {
      return true;
    }
    return false;
  }
}
