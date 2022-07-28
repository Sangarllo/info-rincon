import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Observable, Subscription } from 'rxjs';

import { IEvent } from '@models/event';
import { Appointment, IAppointment } from '@models/appointment';
import { IPicture } from '@models/picture';
import { IEventRef } from '@models/event-ref';
import { EventService } from '@services/events.service';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { AppointmentsService } from '@services/appointments.service';
import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-event-ref-dialog',
  templateUrl: './event-ref-dialog.component.html',
  styleUrls: ['./event-ref-dialog.component.scss']
})
export class EventRefDialogComponent implements OnInit, OnDestroy {

  pictureSelected: IPicture;
  pictures: IPicture[];

  title = 'Añade un nuevo evento de este superevento';
  appointment: IAppointment;
  eventRefForm: FormGroup;
  eventMapped: boolean;
  thisScheduleId: string;
  orderId: number;
  imageIdSelected: string;
  imagePathSelected: string;
  dateStr: string;
  timeStr: string;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private appointmentSrv: AppointmentsService,
    private pictureSrv: PictureService,
    private eventSrv: EventService,
    public dialogRef: MatDialogRef<EventRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public event: IEvent) {
  }

  // Using desc to swich operation:
  //  '' -> CREATE SCHEDULE ITEM
  //  'X' -> EDIT SCHEDULE X

  ngOnInit(): void {

      // console.log(`EventScheduleDialogComponent.ngOnInit(${this.event.extra})`);

      this.eventMapped = false;

      const eventId = this.event.id;
      if ( eventId ) {
        this.getDetails(eventId);
      }

      this.getPictures();

      this.eventRefForm = this.fb.group({
          name: [ '', [Validators.required]],
          imageId: [ '', []],
          imagePath: [ '', []],
          dateStr: [ '', []],
          timeStr: [ Appointment.HOUR_DEFAULT, []],
          eventId: [ '', []],
          description: [ '', []],
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
          this.displayDetails();
      });

    this.listOfObservers.push(subs1$);
  }

  displayDetails(): void {

    const name = '';
    this.imageIdSelected = this.event.imageId;
    this.imagePathSelected = this.event.imagePath;

    this.eventRefForm.patchValue({
      name,
      imageId: this.imageIdSelected,
      imagePath: this.imagePathSelected,
      dateStr: this.appointment.dateIni,
      timeStr: this.appointment.timeIni,
      eventId: '',
      description: '',
    });
  }

  onSelectedImage(picture: IPicture): void {
    this.pictureSelected = picture;
  }

  onDateIniChange(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.appointmentSrv.formatDate(event.value);
    console.log(`onDateIniChange(${event.value} --> ${newDate})`);
    this.dateStr = newDate;
  }

  onNoClick(): void {
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  search(): void {
    const eventId = this.eventRefForm.controls.eventId.value;
    let eventName = '';
    console.log(`buscando ${eventId}`);

    const subs1$ = this.eventSrv.getOneEvent(eventId)
        .subscribe((event: IEvent) => {
            eventName = event.name;
            console.log(`evento encontrado ${eventName}`);
            const subs2$ = this.appointmentSrv.getOneAppointment(eventId)
                .subscribe((appointment: IAppointment) => {
                    this.appointment = appointment;

                    this.eventRefForm.patchValue({
                      name: eventName,
                      imageId: event.imageId,
                      imagePath: event.imageId,
                      dateStr: this.appointment.dateIni,
                      timeStr: this.appointment.timeIni,
                      eventId,
                      description: event.description
                    });

                    this.eventMapped = true;
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

  discard(): void {
    this.ngOnInit();
  }


  save(): void {

    const name = this.eventRefForm.controls.name.value;
    const timeStr = this.eventRefForm.controls.timeStr.value;
    const dateStr: string = this.eventRefForm.controls.dateStr.value.toString();
    const eventId = this.eventRefForm.controls.eventId.value;
    const description = this.eventRefForm.controls.description.value;

    const newEventRef: IEventRef = {
      id: this.utilsSrv.getGUID(),
      name,
      imageId: this.pictureSelected.id,
      imagePath: this.pictureSelected.path,
      dateStr: dateStr.substring(0, 10),
      timeStr,
      eventId,
      description
    };

    this.dialogRef.close(newEventRef);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
