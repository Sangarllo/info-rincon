/* eslint-disable no-debugger */
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Observable, Subscription } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { Place } from '@models/place';
import { IPicture } from '@models/picture';
import { SCHEDULE_TYPE_DEFAULT } from '@models/shedule-type.enum';
import { ScheduleType } from '@models/shedule-type.enum';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { AppointmentsService } from '@services/appointments.service';
import { PlaceService } from '@services/places.service';
import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-event-schedule-dialog',
  templateUrl: './event-schedule-dialog.component.html',
  styleUrls: ['./event-schedule-dialog.component.scss']
})
export class EventScheduleDialogComponent implements OnInit, OnDestroy {

  pictureSelected: IPicture;
  pictures: IPicture[];

  title = 'Configura un nuevo acto para este evento';
  appointment: IAppointment;
  scheduleItemForm: FormGroup;
  thisScheduleId: string;
  orderId: number;
  imageIdSelected: string;
  imagePathSelected: string;
  dateIni: string;
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
    public dialogRef: MatDialogRef<EventScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: IEvent) {

      this.places$ = this.placeSrv.getAllPlacesBase();
  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {

      // console.log(`EventScheduleDialogComponent.ngOnInit(${this.event.extra})`);

      const eventId = this.event.id;
      if ( eventId ) {
        this.getDetails(eventId);
      }

      this.getPictures();

      this.scheduleItemForm = this.fb.group({
          id: [ {value: '', disabled: true}, []],
          order: [ {value: '', disabled: true}, []],
          imageId: [ '', []],
          imagePath: [ '', []],
          name: [ '', []],
          description: [ '', []],
          dateIni: [ '', []],
          timeIni: [ Appointment.HOUR_DEFAULT, []],
          place: [this.SECTION_BLANK, [Validators.required]],
      });
  }

  getPictures(): void {
    this.pictureSrv.getPictureFromImage(this.event.imageId)
      .subscribe((picture: IPicture) => {
        this.pictureSelected = picture;
      });

    this.pictureSrv.getSeveralPicturesFromImages(this.event.images)
      .subscribe((pictures: IPicture[]) => {
        this.pictures = pictures;
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

    const scheduleType = ( this.event.scheduleType ) ?? SCHEDULE_TYPE_DEFAULT;
    let name = '';
    let description = '';

    if ( this.event.extra === '' ) {
      // -> Schedule Item Nuevo
      const GUID = this.utilsSrv.getGUID();
      this.thisScheduleId = `${this.event.id}_${GUID}`;
      this.title = `Configura un nuevo ${scheduleType} para este evento`;
      description = '';
      this.orderId = this.event.scheduleItems.length + 1;
      name = `${scheduleType} ${this.orderId}`;
      this.imageIdSelected = this.event.imageId;
      this.imagePathSelected = this.event.imagePath;
      this.placeBaseSelected = this.SECTION_BLANK;
    } else {
      // -> Schedule Item ya existente
      this.thisScheduleId = this.event.extra;
      const scheduleEdited = this.event.scheduleItems.find( item => item.id === this.thisScheduleId );
      name = scheduleEdited.name;
      this.title = `Edita los datos de ${name}`;
      description = scheduleEdited.description;
      this.imageIdSelected = scheduleEdited.imageId;
      this.imagePathSelected = scheduleEdited.imagePath;
      const datetimeIni = scheduleEdited.extra.split(' ');
      this.appointment.dateIni = datetimeIni[0];
      this.appointment.timeIni = datetimeIni[1];
      this.orderId = scheduleEdited.order;
      this.placeBaseSelected = scheduleEdited.place as Base;
    }

    this.scheduleItemForm.patchValue({
      id: this.thisScheduleId,
      order: this.orderId,
      imageId: this.imageIdSelected,
      imagePath: this.imagePathSelected,
      name,
      description,
      dateIni: this.appointment.dateIni,
      timeIni: this.appointment.timeIni,
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

  comparePictureFunction(o1: any, o2: any): boolean {
    return (o1.id === o2.id);
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    this.dateIni = newDate;
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    const timeIni = this.scheduleItemForm.controls.timeIni.value;
    const dateIniStr = `${this.dateIni} ${timeIni}`;
    const name = this.scheduleItemForm.controls.name.value;

    const newBase: IBase = {
      id: this.thisScheduleId,
      order: this.orderId,
      active: true,
      name,
      imageId: this.pictureSelected.id,
      imagePath: this.pictureSelected.path,
      baseType: BaseType.EVENT,
      description: this.scheduleItemForm.controls.description.value,
      extra: dateIniStr,
      extra2: name.toLowerCase().indexOf('inscrip') > -1 ?
        ScheduleType.FechaLimite : ''
    };

    if ( this.placeBaseSelected?.id !== '0' ) {
      newBase.place = this.placeBaseSelected;
    }

    // this.utilsSrv.swalFire(SwalMessage.OK_CHANGES, 'x elementos');
    this.dialogRef.close(newBase);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
