import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Observable, Subscription } from 'rxjs';

import { IBase, Base } from '@models/base';
import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { IPicture } from '@models/picture';
import { Place } from '@models/place';
import { IEventRef } from '@models/event-ref';
import { EventService } from '@services/events.service';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { AppointmentsService } from '@services/appointments.service';
import { PictureService } from '@services/pictures.service';
import { PlaceService } from '@services/places.service';

@Component({
  selector: 'app-event-ref-dialog',
  templateUrl: './event-ref-dialog.component.html',
})
export class EventRefDialogComponent implements OnInit, OnDestroy {

  pictureSelected: IPicture;
  pictures: IPicture[];

  title = 'Añade un nuevo evento de este superevento';
  appointment: IAppointment;
  eventRefForm: FormGroup;
  thisRefId: string;
  eventMapped: boolean;
  eventMappedName: string;
  orderId: number;
  imageIdSelected: string;
  imagePathSelected: string;
  dateIni: string;
  timeIni: string;
  placeBaseSelected: Base;
  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;
  readonly SECTION_BLANK: Base = Place.InitDefault();
  places$: Observable<IBase[]>;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private appointmentSrv: AppointmentsService,
    private pictureSrv: PictureService,
    private placeSrv: PlaceService,
    private eventSrv: EventService,
    public dialogRef: MatDialogRef<EventRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: IEvent) {

      this.places$ = this.placeSrv.getAllPlacesBase();
  }

  ngOnInit(): void {

      this.eventMapped = false;
      this.eventMappedName = '';

      const eventId = this.event.id;
      if ( eventId ) {
        this.getDetails(eventId);
      }

      this.getPictures(this.event, false);

      this.eventRefForm = this.fb.group({
          eventId: [ '', []],
          imageId: [ '', []],
          imagePath: [ '', []],
          name: [ '', [Validators.required]],
          description: [ '', []],
          dateIni: [ '', []],
          timeIni: [ Appointment.HOUR_DEFAULT, []],
          isTimeIni: [ true, []],
          place: [this.SECTION_BLANK, [Validators.required]],
      });
  }

  getPictures(event: IEvent, eventMapped: boolean): void {
    this.pictureSrv.getPictureFromImage(event.imageId)
      .subscribe((picture: IPicture) => {
          this.pictureSelected = picture;

          if ( eventMapped ) {
              this.pictures = [picture];
          } else {
              this.pictureSrv.getSeveralPicturesFromImages(event.images)
                  .subscribe((pictures: IPicture[]) => {
                      this.pictures = pictures;
              });
          }
      });
  }

  getDetails(eventId: string): void {
    const subs1$ = this.appointmentSrv.getOneAppointment(eventId)
      .subscribe((appointment: IAppointment) => {
          this.appointment = appointment;
          this.dateIni = this.appointment.dateIni;
          this.displayDetails();
      });

    this.listOfObservers.push(subs1$);
  }

  displayDetails(): void {

    let name = '';
    let description = '';
    let dateIni = '';
    let timeIni = '';

    if ( this.event.extra === '' ) {
        // -> EventRef Nuevo
        this.thisRefId = this.utilsSrv.getGUID();

        this.title = 'Añade un nuevo evento de este superevento';

        this.imageIdSelected = this.event.imageId;
        this.imagePathSelected = this.event.imagePath;
        this.placeBaseSelected = ( this.event.placeItems[0] as Base ) ?? this.SECTION_BLANK;

        dateIni = this.appointment.dateIni;
        timeIni = this.appointment.timeIni;
    } else {
        // -> EventRef ya existente
        this.thisRefId = this.event.extra;

        this.title = 'Editando evento en el superevento';

        const refEdited = this.event.eventsRef.find( item => item.id === this.thisRefId );

        name = refEdited.name;
        description = refEdited.description;
        this.imageIdSelected = refEdited.imageId;
        this.imagePathSelected = refEdited.imagePath;
        // const datetimeIni = refEdited.
        // this.appointment.dateIni = datetimeIni[0];
        // this.appointment.timeIni = datetimeIni[1];
        this.placeBaseSelected = refEdited.place as Base;

        dateIni = refEdited.dateIni;
        timeIni = refEdited.timeIni;
    }

    const timeRegex = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
    const test = timeRegex.test(timeIni);

    this.eventRefForm.patchValue({
      id: this.thisRefId,
      eventId: '',
      imageId: this.imageIdSelected,
      imagePath: this.imagePathSelected,
      name,
      description,
      dateIni,
      timeIni,
      isTimeIni: timeRegex.test(timeIni),
      place: this.placeBaseSelected,
    });
  }

  onSelectedImage(picture: IPicture): void {
    this.pictureSelected = picture;
  }

  onSelectionChanged(event: any): void {
    this.placeBaseSelected = event.value;
  }

  compareFunction(o1: IBase, o2: IBase): boolean {
    return (o1.id === o2.id && o1.name === o2.name);
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.dateIni = newDate;
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  search(): void {
    const eventId = this.eventRefForm.controls.eventId.value;
    let eventName = '';

    const subs1$ = this.eventSrv.getOneEvent(eventId)
        .subscribe((event: IEvent) => {
            eventName = event.name;
            const subs2$ = this.appointmentSrv.getOneAppointment(eventId)
                .subscribe((appointment: IAppointment) => {
                    this.appointment = appointment;

                    this.placeBaseSelected = this.SECTION_BLANK;
                    if ( event.placeItems[0] ) {
                      this.placeBaseSelected = event.placeItems[0] as Base;
                    }

                    this.getPictures(event, true);

                    this.eventRefForm.patchValue({
                      name: eventName,
                      imageId: event.imageId,
                      imagePath: event.imageId,
                      dateIni: this.appointment.dateIni,
                      timeIni: this.appointment.timeIni,
                      isTimeIni: true,
                      eventId,
                      description: '',
                      place: this.placeBaseSelected,
                    });

                    this.eventMapped = true;
                    this.eventMappedName = eventName;
                    this.eventRefForm.controls.eventId.disable();
                });
            this.listOfObservers.push(subs2$);

            const subs3$ = this.pictureSrv.getPictureFromImage(event.imageId)
            .subscribe((picture: IPicture) => {
              this.pictureSelected = picture;
            });
            this.listOfObservers.push(subs3$);
        });

      this.listOfObservers.push(subs1$);
  }

  clearMapped(): void {
    this.ngOnInit();
  }


  save(): void {

    const name = this.eventRefForm.controls.name.value;
    const timeIni = this.eventRefForm.controls.timeIni.value;
    const eventId = this.eventRefForm.controls.eventId.value;
    const description = this.eventRefForm.controls.description.value;

    const newEventRef: IEventRef = {
      id: this.thisRefId,
      imageId: this.pictureSelected.id,
      imagePath: this.pictureSelected.path,
      name,
      dateIni: this.dateIni,
      timeIni,
      eventId,
      description
    };

    if ( this.placeBaseSelected?.id !== '0' ) {
      newEventRef.place = this.placeBaseSelected;
    }

    this.dialogRef.close(newEventRef);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
