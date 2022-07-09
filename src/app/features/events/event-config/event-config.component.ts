import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/auth.service';
import { Base, IBase, BaseType } from '@models/base';
import { IAppointment, Appointment, ShowMode } from '@models/appointment';
import { IEvent, Event } from '@models/event';
import { IItemSocial } from '@models/item-social';
import { IUser } from '@models/user';
import { AuditType } from '@models/audit';
import { IComment } from '@models/comment';
import { IPicture } from '@models/picture';
import { ILinkItem } from '@models/link-item';
import { CommentsService } from '@services/comments.service';
import { EventService } from '@services/events.service';
import { ItemSocialService } from '@services/items-social.service';
import { AppointmentsService } from '@services/appointments.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { LinksItemService } from '@services/links-item.service';
import { LogService } from '@services/log.service';
import { PictureService } from '@services/pictures.service';
import { UserService } from '@services/users.service';

import { EventBasicDialogComponent } from '@features/events/event-basic-dialog/event-basic-dialog.component';
import { EventStatusDialogComponent } from '@features/events/event-status-dialog/event-status-dialog.component';
import { EventAppointmentDialogComponent } from '@features/events/event-appointment-dialog/event-appointment-dialog.component';
import { EventImageDialogComponent } from '@features/events/event-image-dialog/event-image-dialog.component';
import { EventNewBaseDialogComponent } from '@features/events/event-new-base-dialog/event-new-base-dialog.component';
import { EventScheduleDialogComponent } from '@features/events/event-schedule-dialog/event-schedule-dialog.component';
import { EventLinkDialogComponent } from '@features/events/event-link-dialog/event-link-dialog.component';
import { LinkItemDialogComponent } from '@features/links/link-item-dialog/link-item-dialog.component';
import { LinkItemType, LINK_ITEM_TYPES, LINK_ITEM_TYPE_DEFAULT } from '@models/link-item-type.enum';


@Component({
  selector: 'app-event-config',
  templateUrl: './event-config.component.html',
  styleUrls: ['./event-config.component.scss']
})
export class EventConfigComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  shownAsAWholeControl = new FormControl();
  public event: IEvent;
  public eventSocial: IItemSocial;
  public comments$: Observable<IComment[]>;
  public idEvent: string;
  public eventPicture: IPicture;
  public appointment$: Observable<IAppointment>;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  public dialogConfig = new MatDialogConfig();
  public baseType = BaseType.EVENT;
  public audit = environment.setAudit;
  public socialUsersFav = [];
  public socialNClaps = 0;
  public linksItem = [];
  private currentUser: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private logSrv: LogService,
    private utilsSrv: UtilsService,
    private eventSrv: EventService,
    private itemSocialSrv: ItemSocialService,
    private linksItemSrv: LinksItemService,
    private commentSrv: CommentsService,
    private pictureSrv: PictureService,
    private appointmentSrv: AppointmentsService,
    private userSrv: UserService,
  ) {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '600px';
  }

  ngOnInit(): void {

    const subs1$ = this.authSrv.currentUser$.subscribe( (user: any) => {
      this.currentUser = user;
    });

    this.idEvent = this.route.snapshot.paramMap.get('id');
    this.appointment$ = this.appointmentSrv.getOneAppointment(this.idEvent);
    if ( this.idEvent ) {
      this.getDetails(this.idEvent);
    }

    this.listOfObservers.push(subs1$);
  }

  getDetails(idEvent: string): void {
    this.eventSrv.getOneEvent(idEvent)
    .subscribe((event: IEvent) => {
      this.event = event;

      this.pictureSrv.getPictureFromImage(this.event.imageId)
      .subscribe((picture: IPicture) => {
          this.eventPicture = picture;
      });

      this.itemSocialSrv.getItemSocial(idEvent)
      .subscribe( (eventSocial: IItemSocial) => {
          this.eventSocial = eventSocial;
          this.comments$ = this.commentSrv.getAllComments(idEvent);

          this.socialNClaps = this.eventSocial.nClaps;
          if ( eventSocial.usersFavs?.length > 0 ) {
            this.userSrv.getSeveralUsers(eventSocial.usersFavs)
            .subscribe((users: IUser[]) => {
              this.socialUsersFav = users;
            });
          } else {
            this.socialUsersFav = [];
          }
      });

      // Link Items
      this.linksItemSrv.getLinksItemByItemId(idEvent)
        .subscribe((linksItem: ILinkItem[]) => {
          // console.log(`linksItem: ${JSON.stringify(linksItem)}`);
          this.linksItem = linksItem;
        });

      this.shownAsAWholeControl.setValue(String(this.event.shownAsAWhole));
    });
  }

  public gotoList(): void {
    this.router.navigate([`/${Event.PATH_URL}`]);
  }

  public gotoItemView(): void {
    // TODO: in a modal dialog?
    this.router.navigate([`/${Event.PATH_URL}/${this.idEvent}`]);
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  openEventBasicDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventBasicDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      if ( eventDialog ) {
        this.event.name = eventDialog.name;
        this.event.description = eventDialog.description;
        this.event.sanitizedUrl = eventDialog.sanitizedUrl;
        this.event.categories = eventDialog.categories;
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO);
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEventImageDialog(): void {
    this.dialogConfig.data = [this.event.imageId, this.event.images];
    const dialogRef = this.dialog.open(EventImageDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((imagesDialog: [IPicture, IPicture[]]) => {
      if ( imagesDialog ) {

        this.eventPicture = imagesDialog[0];
        console.log(`eventPicture: ${JSON.stringify(this.eventPicture)}`);
        this.event.imageId = this.eventPicture.id;
        this.event.imagePath = this.eventPicture.path;

        const pictures: IPicture[] = imagesDialog[1];
        this.event.images = this.pictureSrv.getImagesFromPictures(pictures);

        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Modificada imagen');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEventStatusDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventStatusDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      if ( eventDialog ) {
        this.event.status = eventDialog.status;
        this.event.active = eventDialog.active;
        this.event.focused = eventDialog.focused;
        this.event.fixed = eventDialog.fixed ?? false;
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_STATUS );
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openPlaceDialog(): void {
    this.dialogConfig.data = BaseType.PLACE;
    const dialogRef = this.dialog.open(EventNewBaseDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newBase: IBase) => {
      if ( newBase ) {
        this.event.placeItems.push(newBase);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Añadida ubicacíon');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openEntityDialog(): void {
    this.dialogConfig.data = BaseType.ENTITY;
    const dialogRef = this.dialog.open(EventNewBaseDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newBase: IBase) => {
      if ( newBase ) {
        this.event.entityItems.push(newBase);
        this.event.entitiesArray.push(newBase.id);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Añadida entidad');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openAppointmentDialog(): void {
    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventAppointmentDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((newAppointment: IAppointment) => {
      if ( newAppointment ) {
        this.appointmentSrv.updateAppointment(newAppointment);
        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openScheduleDialog(scheduleItemId: string): void {
    if ( scheduleItemId === '' ) {
      this.event.extra = ''; // New Item
    } else {
      this.event.extra = scheduleItemId; // Edit existing item
    }

    this.dialogConfig.data = this.event;
    const dialogRef = this.dialog.open(EventScheduleDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((scheduleItem: IBase) => {

      if ( scheduleItem ) {

        console.log(`scheduleItem: ${JSON.stringify(scheduleItem)}`);

        const index = this.event.scheduleItems.findIndex(item => item.id === scheduleItem.id);
        if ( index < 0 ) { // Adding new ScheduleItem and appointment
          this.event.scheduleItems.push(scheduleItem);
          this.appointmentSrv.addScheduleAppointment(
            scheduleItem,
            !this.event.shownAsAWhole
          );
        } else {
          this.event.scheduleItems[index] = scheduleItem;
          const scheduleAppointment = Appointment.InitFromSchedule(scheduleItem, !this.event.shownAsAWhole);
          this.appointmentSrv.updateAppointment(scheduleAppointment);
        }

        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');

      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openLinkDialog(linkItemId: string): void {

    console.log(`openLinkDialog ${linkItemId}`);

    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '500px';
    this.dialogConfig.data = {
      event: this.event,
      linkItemBase: this.event.linkItems.find(item => item.id === linkItemId)
    };

    const dialogRef = this.dialog.open(EventLinkDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((linkItem: IBase) => {

      if ( linkItem ) {

        const index = this.event.linkItems.findIndex(item => item.id === linkItem.id);
        if ( index < 0 ) { // Adding new LinkItem
          this.event.linkItems.push(linkItem);
        } else {
          this.event.linkItems[index] = linkItem;
        }

        this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado enlace');

      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }

  openLinkItemDialog(linkItemId: string): void {

    console.log(`openLinkItemDialog ${linkItemId}`);

    this.dialogConfig.width = '500px';
    this.dialogConfig.height = '600px';
    this.dialogConfig.data = {
      event: this.event,
      linkItemBase: this.event.linkItems.find(item => item.id === linkItemId)
    };

    const dialogRef = this.dialog.open(LinkItemDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((linkItem: IBase) => {

      if ( linkItem ) {

        const eventBase = this.event as IBase;
        const linkItemTypeKey = linkItem.extra;

        console.log(`after closing: ${JSON.stringify(linkItem)}`);

        this.linksItemSrv.addLinkItem(
          eventBase,
          linkItemTypeKey,
          linkItem.name,
          linkItem.description,
          linkItem.sourceUrl
        );

      } else {
        this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
      }
    });
  }


  changeOrderBaseItemFromTable(base: IBase): void {
    // this.logSrv.info(`changeOrderScheduleItem ${base.id}`);
    const baseId =  base.id;
    const input = baseId.split('|');
    const id1 = input[0];
    const change = +input[1];

    let order1: number;
    let order2: number;
    let id2: string;

    switch ( base.baseType ) {

      case BaseType.EVENT:

          order1 = this.event.scheduleItems.find(item => item.id === baseId).order;
          order2 = order1 + change;
          id2 = this.event.scheduleItems.find(item => item.order === order2).id;

          // Reestablish
          this.event.scheduleItems.find(item => item.id === baseId).id = id1;

          // Exchange
          this.event.scheduleItems.find(item => item.id === id1).order = order2;
          this.event.scheduleItems.find(item => item.id === id2).order = order1;

          // Order
          this.event.scheduleItems = this.event.scheduleItems.sort((item1: IBase, item2: IBase) => {
            if (item1.order > item2.order) { return 1; }
            if (item1.order < item2.order) { return -1; }
            return 0;
          });

          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
          break;

      case BaseType.LINK:

          order1 = this.event.linkItems.find(item => item.id === baseId).order;
          order2 = order1 + change;
          id2 = this.event.linkItems.find(item => item.order === order2).id;

          // Reestablish
          this.event.linkItems.find(item => item.id === baseId).id = id1;

          // Exchange
          this.event.linkItems.find(item => item.id === id1).order = order2;
          this.event.linkItems.find(item => item.id === id2).order = order1;

          // Order
          this.event.linkItems = this.event.linkItems.sort((item1: IBase, item2: IBase) => {
            if (item1.order > item2.order) { return 1; }
            if (item1.order < item2.order) { return -1; }
            return 0;
          });

          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
    }
  }

  addBaseItemFromTable(base: IBase): void {
    this.logSrv.info(`addScheduleItem: ${JSON.stringify(base)}`);

    switch ( base.baseType ){

      case BaseType.EVENT:

          this.event.scheduleItems.find(item => item.id === base.id).active = true;
          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
          this.appointmentSrv.updateShowModeAppointment(
              base.id,
              this.event.active,
              ( this.event.shownAsAWhole ) ?
                  ShowMode.OVERSHADOWED_BY_WHOLE :
                  ShowMode.SHOWED_AS_SLICE
          );
          break;

      case BaseType.LINK:

          this.event.linkItems.find(item => item.id === base.id).active = true;
          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado enlace');
          break;

    }
  }

  deleteBaseItemFromTable(base: IBase): void {
    this.logSrv.info(`deleteScheduleItem: ${JSON.stringify(base)}`);
    switch ( base.baseType ){

      case BaseType.EVENT:
          this.event.scheduleItems.find(item => item.id === base.id).active = false;
          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
          this.appointmentSrv.enableAppointment(base.id, false);
          break;

      case BaseType.LINK:
          this.event.linkItems.find(item => item.id === base.id).active = false;
          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado links');
          break;
    }
  }

  editBaseItemFromTable(base: IBase): void {
    switch ( base.baseType ){

        case BaseType.EVENT:
            this.logSrv.info(`editBaseItemFromTable: ${JSON.stringify(base.baseType)}`);
            this.openScheduleDialog(base.id);
            break;

        case BaseType.LINK:
            this.logSrv.info(`editBaseItemFromTable: ${JSON.stringify(base.baseType)}`);
            this.openLinkDialog(base.id);
            break;

    }
  }

  deleteForeverBaseItemFromTable(base: IBase): void {

    const baseItemId = base.id;
    switch ( base.baseType ){

      case BaseType.EVENT:

          this.event.scheduleItems = this.event.scheduleItems.filter(item => item.id !== baseItemId);

          if ( this.event.scheduleItems.length === 0 ) {
            this.onValShownAsAWholeChange('true');
          } else {
            this.event.scheduleItems.forEach( item => {
              if ( +item.id > +baseItemId ) {
                item.id = String(+item.id - 1);
              };
            });
          }

          this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado horario');
          this.appointmentSrv.deleteAppointment(baseItemId);
          break;

      case BaseType.LINK:

            this.event.linkItems = this.event.linkItems.filter(item => item.id !== baseItemId);

            this.event.linkItems.forEach( item => {
                if ( +item.id > +baseItemId ) {
                    item.id = String(+item.id - 1);
                };
            });

            this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Eliminado enlace');
            break;
      }
  }

  deleteEntity(base: IBase): void {
    this.logSrv.info(`deleteEntity: ${JSON.stringify(base)}`);

    const entityId = base.id;
    this.event.entityItems = this.event.entityItems.filter(item => item.id !== entityId);
    this.event.entitiesArray = this.event.entitiesArray.filter(itemId => itemId !== entityId);

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizadas sus entidades');
  }

  deletePlace(base: IBase): void {
    this.logSrv.info(`deletePlace: ${JSON.stringify(base)}`);

    const placeId = base.id;
    this.event.placeItems = this.event.placeItems.filter(item => item.id !== placeId);

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado placeItems');
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  onValShownAsAWholeChange(shownAsAWhole: string){
    this.event.shownAsAWhole = ( shownAsAWhole === 'true' ) ? true : false;

    this.appointmentSrv.updateShowModeAppointment(
      this.event.id,
      this.event.active,
      ( shownAsAWhole === 'true' ) ? ShowMode.SHOWED_AS_WHOLE : ShowMode.OVERSHADOWED_BY_SLICE
    );

    this.event.scheduleItems.forEach(scheduleItem => {
        this.appointmentSrv.updateShowModeAppointment(
            scheduleItem.id,
            this.event.active,
            ( shownAsAWhole === 'true' ) ? ShowMode.OVERSHADOWED_BY_WHOLE : ShowMode.SHOWED_AS_SLICE
        );
    });

    this.eventSrv.updateEvent(this.event, AuditType.UPDATED_INFO, 'Actualizado ShownAsAWhole');
  }

  public deleteForeverItem(event: IEvent): void {
    this.logSrv.info(`deleting forever ${event.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventSrv.deleteForeverEvent(event);
        Swal.fire({
          title: '¡Borrado!',
          text: `${event.name} ha sido borrado`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
        this.router.navigate([`/${Event.PATH_URL}`]);
      }
    });
  }
}
