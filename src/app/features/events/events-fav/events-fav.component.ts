import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

import { IEntity } from '@models/entity';
import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { EventService } from '@services/events.service';
import { EntityService } from '@services/entities.service';
import { SpinnerService } from '@services/spinner.service';
import { UserService } from '@services/users.service';
import { ItemSocialService } from '@services/items-social.service';

@Component({
  selector: 'app-events-fav',
  templateUrl: './events-fav.component.html',
  styleUrls: ['./events-fav.component.scss']
})
export class EventsFavComponent implements OnInit, OnDestroy {

  public viewMode = 'cards';
  public events: IEvent[] = [];
  public favEntitiesStr: string[] = [];
  public favEntities$: Observable<IEntity[]>;
  public displayedColumns: string[] = [ 'status', // 'id',
   'timestamp', 'image', 'collapsed-info', 'name', 'categories', 'actions1'];
  public userLogged: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private userSrv: UserService,
    private spinnerSvc: SpinnerService,
    private itemSocialSrv: ItemSocialService,
    private eventSrv: EventService,
    private entitySrv: EntityService
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userSrv.getOneUser(uidUser)
      .subscribe( (user: IUser) => {
        this.userLogged = user;
        this.displayFavEvents();
      });
    });

    this.listOfObservers.push(subs1$);
  }

  displayFavEvents(): void {
      const favEvents = this.userLogged.favEvents;
      this.events = [];

      if ( favEvents?.length > 0 ) {
        this.eventSrv.getSeveralEvent(favEvents)
          .pipe(
            map(events => events.map(event => {
              const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

              event.timestamp = formatDistance(new Date(event.timestamp), new Date(), {locale: es});

              event.description = ( event.categories ) ? event.categories.reduce(reducer, '') : '';
              return { ...event };
            }))
          )
          .subscribe((events: IEvent[]) => {
            this.events = events;
            this.spinnerSvc.hide();
          });
      } else {
        this.spinnerSvc.hide();
      }

      // Entities
      this.favEntitiesStr = this.userLogged.favEntities;
      if ( this.favEntitiesStr?.length > 0 ) {
          this.favEntities$ = this.entitySrv.getSeveralEntities(this.favEntitiesStr);
      };
  }

  public gotoEntity(entity: IEntity): void {
    this.router.navigate([`entidades/${entity.id}`]);
  }

  public gotoEntitiesFav(): void {
    this.router.navigate([`entidades/favoritas`]);
  }

  removeFavEvent(event: IEvent) {

      this.userLogged.favEvents = this.userLogged.favEvents.filter( (id: string) => id !== event.id );
      this.userSrv.updateUser(this.userLogged);

      this.displayFavEvents();

      this.itemSocialSrv.removeFavUser(event.id, event.name, this.userLogged);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
