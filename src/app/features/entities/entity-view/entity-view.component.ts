import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CalendarEvent } from 'angular-calendar';

import Swal from 'sweetalert2';

import { BaseType } from '@models/base';
import { IEntity, Entity } from '@models/entity';
import { IUser } from '@models/user';
import { AuthService } from '@auth/auth.service';
import { SeoService } from '@services/seo.service';
import { ItemSocialService } from '@services/items-social.service';
import { EntityService } from '@services/entities.service';
import { EventService } from '@services/events.service';
import { UserService } from '@services/users.service';
import { IEvent, Event } from '@models/event';

@Component({
  selector: 'app-entity-view',
  templateUrl: './entity-view.component.html',
  styleUrls: ['./entity-view.component.scss']
})
export class EntityViewComponent implements OnInit, OnDestroy {

  public entity$: Observable<IEntity | undefined> | null = null;
  events$: Observable<IEvent[]>;
  public idEntity: string;
  public entityName: string;
  public userLogged: IUser;

  public BTN_IMG_FAVORITE_ON = 'assets/svg/favorite-on.svg';
  public BTN_IMG_FAVORITE_OFF = 'assets/svg/favorite-off.svg';

  readonly today = new Date();
  readonly DATE_MIN = new Date(
      this.today.getFullYear()-1,
      this.today.getMonth(),
      this.today.getDay()).toISOString().substr(0, 10);
  readonly DATE_MAX = new Date(
      this.today.getFullYear()+1,
      this.today.getMonth(),
      this.today.getDay()).toISOString().substr(0, 10);

  private listOfObservers: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private entitiesSrv: EntityService,
    private eventsSrv: EventService,
    private itemSocialSrv: ItemSocialService,
    public authSvc: AuthService,
    private userSrv: UserService,
  ) { }

  ngOnInit(): void {

    const subs1$ = this.authSvc.afAuth.user
      .subscribe( (user: any) => {
          if ( user?.uid ) {
            this.userSrv.getOneUser(user.uid).subscribe( (userLogged: any ) => {
              this.userLogged = userLogged;
          });
          }
      });

    this.idEntity = this.route.snapshot.paramMap.get('id');
    if ( this.idEntity ) {
      this.getDetails(this.idEntity);
      this.fetchEvents();
    }

    this.listOfObservers.push( subs1$ );
  }

  getDetails(idEntity: string): void {
    this.entity$ = this.entitiesSrv.getOneEntity(idEntity)
      .pipe(
        tap(entity => {
            this.entityName = entity.name;
            this.seo.generateTags({
              title: `${entity.name} | Entidad de Rincón de Soto`,
              description: entity.description,
              image: entity.imagePath,
            });
          })
      );
  }

  fetchEvents(): void {
    this.events$ = this.eventsSrv.getEventsByEntityAndRange(
        this.DATE_MIN, this.DATE_MAX,
        this.idEntity
    );
  }

  public setEntityFav(isFav: boolean): void {

    this.userLogged.favEntities = this.userLogged.favEntities ?? [];
    this.userLogged.favEntities = this.userLogged.favEntities.filter( (eventId: string) => eventId !== this.idEntity );

    const itemName = this.entityName;
    const itemId = this.idEntity;

    if ( isFav ) {
      this.userLogged.favEntities.push(itemId);
      this.itemSocialSrv.addFavourite(itemId, BaseType.ENTITY, itemName, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad se ha convertido en uno de tus favoritas',
        confirmButtonColor: '#003A59',
      });
    } else {
      this.itemSocialSrv.removeFavourite(itemId, BaseType.ENTITY, itemName, this.userLogged.uid, this.userLogged.displayName);
      Swal.fire({
        icon: 'success',
        title: 'Esta entidad ha dejado de estar entre tus favoritas',
        confirmButtonColor: '#003A59',
      });
    }
  }

  public gotoList(): void {
    this.router.navigate([`/${Entity.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Entity.PATH_URL}/${this.idEntity}/editar`]);
  }

  public clickItem(event: IEvent): void {
      this.router.navigate([`/${Event.PATH_URL}/${event.id}`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
