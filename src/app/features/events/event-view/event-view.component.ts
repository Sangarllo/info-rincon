import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { Base, IBase } from '@models/base';
import { IEvent, Event } from '@models/event';
import { EventMode } from '@models/event-mode.enum';
import { IUser } from '@models/user';
import { IAppointment, Appointment } from '@models/appointment';
import { AppointmentType } from '@models/appointment-type';
import { ILinkItem } from '@models/link-item';
import { IPicture } from '@models/picture';
import { EventService } from '@services/events.service';
import { LinksItemService } from '@services/links-item.service';
import { UserService } from '@services/users.service';
import { AppointmentsService } from '@services/appointments.service';
import { LinkType } from '@models/link-item-type.enum';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit, OnDestroy {

  public userLogged: IUser;
  public configAllowed: boolean;
  public event: IEvent;
  public linksItemReport = [];
  public linksItemInfo = [];
  public idEventUrl: string;
  public idEvent: string;
  public eventPicture: IPicture;
  public appointment$: Observable<IAppointment>;
  // Subevent = Schedule View
  public idSubevent: string;
  public subEvent: IEvent;
  public appointmentSubEvent: IAppointment;

  readonly SECTION_BLANK: Base = Base.InitDefault();
  readonly EVENT_MODE_SPLITTED = EventMode.SPLITTED;
  readonly EVENT_MODE_SUPEREVENT = EventMode.SUPEREVENT;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userSrv: UserService,
    private appointmentSrv: AppointmentsService,
    private eventSrv: EventService,
    private linksItemSrv: LinksItemService,
  ) {
    this.configAllowed = false;

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid)
                .subscribe( (userLogged: any ) => {
                    this.userLogged = userLogged;
                });
          }
      });

    this.listOfObservers.push( subs1$ );
  }

  ngOnInit(): void {

    const eventResolver: IEvent = this.route.snapshot.data.event;
    // console.log(`Event Resolver: ${JSON.stringify(eventResolver)}`);

    this.idEventUrl = this.route.snapshot.paramMap.get('id');
    this.idEvent = this.idEventUrl.split('_')[0];

    this.idSubevent = this.idEventUrl.split('_')[1];

    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);

    if ( this.idEvent ) {
      this.getDetails(this.idEvent);
    }
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  getDetails(idEvent: string): void {
    const subs2$ = this.eventSrv.getOneEvent(idEvent)
      .subscribe(async (event: IEvent) => {
          this.event = event;
          this.configAllowed = this.canConfig(this.userLogged);

          if ( this.idSubevent ) {
            this.event.scheduleItems.forEach( (schedule: IBase) => {
              if ( schedule.id.split('_')[1] === this.idSubevent ) {
                // console.log(`found! ${JSON.stringify(schedule)}`);
                this.subEvent = schedule as IEvent;

                this.appointmentSubEvent = Appointment.InitDefault(this.idSubevent, AppointmentType.EVENT_DATETIME);
                // TODO review when schedule let complex appointments
                this.appointmentSubEvent.description = Appointment.computeSimpleDesc(this.subEvent.extra);
              }
            });
          }
      });

    // Link Items
    const subs3$ = this.linksItemSrv.getLinksItemByItemId(idEvent, LinkType.INFO)
        .subscribe((linksItem: ILinkItem[]) => {
          this.linksItemInfo = linksItem;
        });

    const subs4$ = this.linksItemSrv.getLinksItemByItemId(idEvent, LinkType.REPORT)
        .subscribe((linksItem: ILinkItem[]) => {
          this.linksItemReport = linksItem;
        });

    this.listOfObservers.push( subs2$ );
    this.listOfObservers.push( subs3$ );
    this.listOfObservers.push( subs4$ );
  }

  public configItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}/config`]);
  }



  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url;
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      // case 'twitter':
      //   const titleTwitter = `${this.event.name} | Rincón de Soto`;
      //   // eslint-disable-next-line max-len
      //   window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(titleTwitter), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
      //   break;

      // case 'facebook':
      //   // eslint-disable-next-line max-len
      //   window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
      //   break;

      case 'whatsapp':
        const titleWhatsapp = `${this.event.name}`;
        window.open(`whatsapp://send?text=_Agenda Rinconera_%0a*${titleWhatsapp}*%0a${SHARED_URL}`);
        break;
    }
  }

  private canConfig(userLogged: IUser): boolean {
    if ( userLogged ) {
      return this.userSrv.canConfig(
        userLogged,
        this.event.usersArray,
        this.event.entitiesArray
      );
    } else {
      return false;
    }
  }
}
