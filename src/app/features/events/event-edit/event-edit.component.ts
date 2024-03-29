import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from '@auth/auth.service';
import { Event, IEvent } from '@models/event';
import { Status } from '@models/status.enum';
import { EVENT_CATEGORIES, Category } from '@models/category.enum';
import { IUser } from '@models/user';
import { AuditType } from '@models/audit';
import { EventService } from '@services/events.service';
import { LogService } from '@services/log.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { EventMode, EVENT_MODE_DEFAULT } from '@models/event-mode.enum';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit, OnDestroy {

  currentUser: IUser;
  eventForm!: UntypedFormGroup;
  pageTitle = 'Creación de un nuevo evento';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public event!: IEvent | undefined;
  public STATUS: Status[] = Event.STATUS;
  public EVENT_MODES: EventMode[] = Event.EVENT_MODES;
  public CATEGORIES: Category[] = EVENT_CATEGORIES;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private authSrv: AuthService,
    private afStorage: AngularFireStorage,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private eventSrv: EventService,
    private utilsSvc: UtilsService,
) { }

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
      fixed: false,
      eventMode: EventMode.SIMPLE,
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      imageId: Event.IMAGE_DEFAULT,
      imagePath: Event.IMAGE_DEFAULT,
      sanitizedUrl: [{value: '', disabled: true}],
      categories: null,
      description: ''
    });

    this.listOfObservers.push(subs1$);
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

      this.listOfObservers.push(subs2$);
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
      fixed: this.event.fixed,
      eventMode: this.event.eventMode ?? EVENT_MODE_DEFAULT,
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
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, this.event.name);
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
