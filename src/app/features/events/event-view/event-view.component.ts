import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";
import { Observable, Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { Base } from '@models/base';
import { IEvent, Event } from '@models/event';
import { IUser } from '@models/user';
import { IAppointment } from '@models/appointment';
import { UserRole } from '@models/user-role.enum';
import { EventService } from '@services/events.service';
import { UserService } from '@services/users.service';
import { AppointmentsService } from '@services/appointments.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private userSrv: UserService,
    private appointmentSrv: AppointmentsService,
    private eventSrv: EventService,
  ) {
    this.adminAllowed = false;

    this.matIconRegistry.addSvgIcon(
      `whatsapp`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/whatsapp.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/facebook.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `twitter`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../../assets/svg/twitter.svg")
    );

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
              this.adminAllowed = this.canAdmin(this.userLogged);
          });
      });

    this.listOfObservers.push( subs1$ );
  }

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
          this.seo.generateTags({
            title: `${event.name} | Rincón de Soto`,
            description: event.description,
            image: event.image,
          });
      });

    this.listOfObservers.push( subs2$ );
  }

  public adminItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}/admin`]);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url.substring(1);
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      case 'twitter':
        const title = `${this.event.name} | Rincón de Soto`;
        window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(title), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'facebook':
        window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'whatsapp':
        window.open(`whatsapp://send?text=${SHARED_URL}`);
        break;
    }
  }

  private canAdmin(userLogged: IUser): boolean {
    if ( userLogged.role !== UserRole.Lector) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
