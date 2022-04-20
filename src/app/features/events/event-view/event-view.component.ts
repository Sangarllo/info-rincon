import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription, timer } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { Base } from '@models/base';
import { IEvent, Event } from '@models/event';
import { IEventSocial } from '@models/event-social';
import { IUser } from '@models/user';
import { IAppointment } from '@models/appointment';
import { IPicture } from '@models/picture';
import { IEventComment } from '@models/comment';
import { EventService } from '@services/events.service';
import { EventSocialService } from '@services/events-social.service';
import { CommentsService } from '@services/comments.service';
import { UserService } from '@services/users.service';
import { AppointmentsService } from '@services/appointments.service';

import { EventCommentsDialogComponent } from '@features/events/event-comments-dialog/event-comments-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit, OnDestroy {

  public userLogged: IUser;
  public configAllowed: boolean;
  public event: IEvent;
  public eventSocial: IEventSocial;
  public isFav = false;
  public applause = false;
  public idEventUrl: string;
  public idEvent: string;
  public idSubevent: string;
  public eventPicture: IPicture;
  public eventComments$: Observable<IEventComment[]>;
  public appointment$: Observable<IAppointment>;
  public dialogConfig = new MatDialogConfig();
  readonly SECTION_BLANK: Base = Base.InitDefault();
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public authSvc: AuthService,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private userSrv: UserService,
    private appointmentSrv: AppointmentsService,
    private eventSrv: EventService,
    private eventSocialSrv: EventSocialService,
    private eventsCommentSrv: CommentsService
  ) {
    this.configAllowed = false;
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';

    // this.matIconRegistry.addSvgIcon(
    //   `whatsapp`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/whatsapp.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `facebook`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/facebook.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `twitter`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/twitter.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `config`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/config.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `clap-on`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/clap-on.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `clap-off`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/clap-off.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `favorite-on`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/favorite-on.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `favorite-off`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/favorite-off.svg')
    // );

    // this.matIconRegistry.addSvgIcon(
    //   `comments`,
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/comments.svg')
    // );

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
              if ( this.userLogged.favEvents?.includes(this.event?.id) ) {
                  this.isFav = true;
              }

              this.configAllowed = this.canConfig(this.userLogged);
          });
          }
      });

    this.listOfObservers.push( subs1$ );
  }

  ngOnInit(): void {

    // const eventTagsResolver: ITags = this.route.snapshot.data.eventTags;
    // console.log(`Event Resolver: ${JSON.stringify(eventTagsResolver)}`);

    const eventResolver: IEvent = this.route.snapshot.data.event;
    console.log(`Event Resolver: ${JSON.stringify(eventResolver)}`);

    this.idEventUrl = this.route.snapshot.paramMap.get('id');
    this.idEvent = this.idEventUrl.split('_')[0];

    this.idSubevent = this.idEventUrl.split('_')[1];

    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);

      this.eventComments$ = this.eventsCommentSrv.getAllEventComments(this.idEvent);

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
          this.eventSocialSrv.getEventSocial(idEvent)
              .subscribe( (eventSocial: IEventSocial) => {
                  this.eventSocial = eventSocial;
              });
      });

    this.listOfObservers.push( subs2$ );
  }

  public configItem(): void {
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}/config`]);
  }

  public viewComments(): void {

    this.dialogConfig.width = '600px';
    this.dialogConfig.height = '600px';
    this.dialogConfig.data = {
      eventId: this.event.id,
      UserUid: this.userLogged?.uid ?? '',
      UserRole: this.userLogged?.role ?? '',
    };

    const dialogRef = this.dialog.open(EventCommentsDialogComponent, this.dialogConfig);
  }

  public shareLink(social: string) {

    const baseUrl = environment.baseUrl;
    const routerUrl = this.router.url;
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
      this.eventSocialSrv.addFavourite(this.eventSocial, this.userLogged.uid);
      Swal.fire({
        icon: 'success',
        title: 'Este evento se ha convertido en uno de tus favoritos',
      });
    } else {
      this.eventSocialSrv.removeFavourite(this.eventSocial, this.userLogged.uid);
      Swal.fire({
        icon: 'success',
        title: 'Este evento ha dejado de estar entre tus favoritos',
      });
    }

    this.userSrv.updateUser(this.userLogged);
  }

  public clap(applause: boolean): void {
    if ( !applause ) {
      console.log(`applause!`);
      this.applause = true;
      this.eventSocialSrv.addClaps(this.eventSocial);
      const source = timer(3000);
      const subsTimer$ = source.subscribe(val => {
        console.log(val);
        this.applause = false;
      });
      this.listOfObservers.push( subsTimer$ );
    }
  }

  private canConfig(userLogged: IUser): boolean {
    return this.userSrv.canConfig(userLogged, this.event?.usersArray);
  }
}
