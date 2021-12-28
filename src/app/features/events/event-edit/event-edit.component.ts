import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AuthService } from '@auth/auth.service';
import { Event, IEvent } from '@models/event';
import { Status } from '@models/status.enum';
import { EVENT_CATEGORIES, Category } from '@models/category.enum';
import { IUser } from '@models/user';
import { AuditType } from '@models/audit';
import { EventService } from '@services/events.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit, OnDestroy {

  currentUser: IUser;
  eventForm!: FormGroup;
  pageTitle = 'Creación de un nuevo evento';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public event!: IEvent | undefined;
  public STATUS: Status[] = Event.STATUS;
  public CATEGORIES: Category[] = EVENT_CATEGORIES;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private authSrv: AuthService,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private eventSrv: EventService) { }

  ngOnInit(): void {

    const subs1$ = this.authSrv.currentUser$
        .subscribe( (user: any) => {
          this.currentUser = user;
        });

    const idEvent = this.route.snapshot.paramMap.get('id');
    if ( idEvent ) {
      this.getDetails(idEvent);
    }

    this.eventForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      status: [ Status.Editing, Validators.required],
      focused: true,
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      imageId: Event.IMAGE_DEFAULT,
      imagePath: Event.IMAGE_DEFAULT,
      sanitizedUrl: '',
      categories: null,
      description: ''
    });

    // this.listOfObservers.push(subs1$); TODO Remove
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  private getDetails(idEvent: string): void {

    if ( idEvent === '0' ) {
      this.pageTitle = 'Creación de un nuevo evento';
      this.event = Event.InitDefault();
    } else {
      const subs2$ = this.eventSrv.getOneEvent(idEvent)
      .subscribe({
        next: (event: IEvent | undefined) => {
          this.event = event;
          this.displayEvent();
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });

      // this.listOfObservers.push(subs2$); TODO Remove
    }
  }


  private displayEvent(): void {

    if (this.eventForm) {
      this.eventForm.reset();
    }

    if (this.event.id === '0') {
      this.pageTitle = 'Creando un nuevo evento';
    } else {
      this.pageTitle = `Editando el evento ${this.event.name}`;
    }

    // Update the data on the form
    this.eventForm.patchValue({
      id: this.event.id,
      active: this.event.active,
      status: this.event.status,
      focused: this.event.focused,
      name: this.event.name,
      imageId: this.event.imageId ?? Event.IMAGE_DEFAULT,
      imagePath: this.event.imagePath ?? Event.IMAGE_DEFAULT,
      sanitizedUrl: this.event.sanitizedUrl,
      categories: this.event.categories ?? [],
      description: ''
    });


    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.eventForm.controls['id'].setValue(this.event.id);
  }

  private onResetForm(): void {
     this.eventForm.reset();
  }

  private onSaveForm(): void {
    if (this.eventForm.valid) {

        const eventItem = { ...this.event, ...this.eventForm.value };

        if (eventItem.id === '0') {
          this.eventSrv.addEvent(eventItem);
          this.logSrv.info(`Evento creado: ${eventItem.name}`);
        } else {
          this.eventSrv.updateEvent(eventItem, AuditType.UPDATED_INFO);
          this.logSrv.info(`Evento modificado: ${eventItem.name}`);
        }

        this.router.navigate([ Event.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  private onSaveComplete(): void {
    // Reset the form to clear the flags
    this.eventForm.reset();
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `Los datos de ${this.event.name} se han guardado correctamente`,
      // footer: '<a href>Why do I have this issue?</a>'
    });
    this.router.navigate([`/${Event.PATH_URL}`]);
  }

  private gotoEventsOwn(): void {
    this.eventForm.reset();
    this.router.navigate([`/${Event.PATH_URL}/propios`]);
  }

  private uploadImage(event): void {
    const file = event.target.files[0];
    const filePath = file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            ( imageUrl: string ) => {

              this.event.imageId = imageUrl;
              this.event.imagePath = imageUrl;

              // Update the data on the form
              this.eventForm.patchValue({
                imageId: this.event.imageId,
                imagePath: this.event.imagePath,
              });
          });
        })
     )
    .subscribe();
  }
}
