import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';
import { Observable, Subscription, timer } from 'rxjs';
import Swal from 'sweetalert2';

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

  public userLogged: IUser;
  public configAllowed: boolean;
  public event: IEvent;
  public isFav = false;
  public applause = false;
  public idEvent: string;
  public appointment$: Observable<IAppointment>;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  private listOfObservers: Array<Subscription> = [];

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
    this.configAllowed = false;

    this.matIconRegistry.addSvgIcon(
      `whatsapp`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/whatsapp.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/facebook.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `twitter`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/twitter.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `clap-on`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/clap-on.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `clap-off`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/clap-off.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `favorite-on`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/favorite-on.svg')
    );

    this.matIconRegistry.addSvgIcon(
      `favorite-off`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/svg/favorite-off.svg')
    );

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
              if ( this.userLogged.favEvents?.includes(this.event.id) ) {
                  this.isFav = true;
              }

              this.configAllowed = this.canConfig(this.userLogged);
          });
          }
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

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
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

  public configItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}/config`]);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url.substring(1);
    const SHARED_URL = `${baseUrl}${routerUrl}`;

    switch ( social ) {
      case 'twitter':
        const title = `${this.event.name} | Rincón de Soto`;
        // eslint-disable-next-line max-len
        window.open('http://twitter.com/share?url='+encodeURIComponent(SHARED_URL)+'&text='+encodeURIComponent(title), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'facebook':
        // eslint-disable-next-line max-len
        window.open('http://facebook.com/sharer/sharer.php?u='+encodeURIComponent(SHARED_URL), '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
        break;

      case 'whatsapp':
        window.open(`whatsapp://send?text=${SHARED_URL}`);
        break;
    }
  }

  public isFavorite(isFav: boolean): void {

    this.userLogged.favEvents = this.userLogged.favEvents ?? [];
    this.userLogged.favEvents = this.userLogged.favEvents.filter( (eventId: string) => eventId !== this.event.id );

    this.isFav = !this.isFav;
    if ( isFav ) {
      this.userLogged.favEvents.push(this.event.id);
      this.eventSrv.addFavourite(this.event, this.userLogged.uid);
      Swal.fire({
        icon: 'success',
        title: 'Este evento se ha convertido en uno de tus favoritos',
      });
    } else {
      this.eventSrv.removeFavourite(this.event, this.userLogged.uid);
      Swal.fire({
        icon: 'success',
        title: 'Este evento ha dejado de estar entre tus favoritos',
      });
    }

    this.userSrv.updateUser(this.userLogged);
  }

  public clap(): void {
    console.log(`applause!`);
    this.applause = true;
    this.eventSrv.addClaps(this.event);
    const source = timer(3000);
    const subsTimer$ = source.subscribe(val => {
      console.log(val);
      this.applause = false;
    });
    this.listOfObservers.push( subsTimer$ );
  }

  private canConfig(userLogged: IUser): boolean {
    if ( userLogged.role !== UserRole.Lector) {
      return true;
    }
    return false;
  }
}
