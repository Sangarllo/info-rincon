/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILink, Link } from '@models/link';
import { Status } from '@models/status.enum';
import { ISource, DEFAULT_SOURCE, NEWS_SOURCES } from '@models/source';
import { Category, LINK_CATEGORIES } from '@models/category.enum';
import { AppointmentsService } from '@services/appointments.service';
import { LinksService } from '@services/links.services';
import { LogService } from '@services/log.service';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-link-edit',
  templateUrl: './link-edit.component.html',
  styleUrls: ['./link-edit.component.scss']
})
export class LinkEditComponent implements OnInit, OnDestroy {

  linkForm!: UntypedFormGroup;
  pageTitle = 'Creación de un nuevo enlace';
  errorMessage = '';
  sourceSelected: ISource;
  uploadPercent: Observable<number>;

  private listOfObservers: Array<Subscription> = [];
  public link!: ILink | undefined;
  public STATUS: Status[] = Link.STATUS;
  public CATEGORIES: Category[] = LINK_CATEGORIES;
  public SOURCES: ISource[] = NEWS_SOURCES;
  public urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(
    private afStorage: AngularFireStorage,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private appointmentSrv: AppointmentsService,
    private linksSrv: LinksService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit(): void {

    const idLink = this.route.snapshot.paramMap.get('id');
    if ( idLink ) {
      this.logSrv.info(`id asked ${idLink}`);
      this.getDetails(idLink);
    }

    this.sourceSelected = DEFAULT_SOURCE;
    this.linkForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      status: [ Status.Editing, Validators.required],
      focused: true,
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
      image: Link.IMAGE_DEFAULT,
      categories: null,
      description: '',
      timestamp: null,
      source: this.sourceSelected,
      sourceUrl: ['', [Validators.required, Validators.pattern(this.urlRegex)]]
    });
  }

  private getDetails(idLink: string): void {
    this.logSrv.info(`id asked ${idLink}`);

    if ( idLink === '0' ) {
      this.pageTitle = 'Creación de una nueva noticia';
      this.link = Link.InitDefault();
    } else {
      const subs1$ = this.linksSrv.getOneLink(idLink)
        .subscribe({
          next: (link: ILink | undefined) => {
            this.link = link;
            this.displayLink();
            this.logSrv.info(JSON.stringify(this.link));
          },
          error: err => {
            this.errorMessage = `Error: ${err}`;
          }
        });

      this.listOfObservers.push(subs1$);
    }
  }

  displayLink(): void {

    if (this.linkForm) {
      this.linkForm.reset();
    }

    if (this.link.id === '0') {
      this.pageTitle = 'Creando un nuevo enlace';
    } else {
      this.pageTitle = `Editando el enlace ${this.link.name}`;
    }

    this.sourceSelected = this.link.source;

    // Update the data on the form
    this.linkForm.patchValue({
      id: this.link.id,
      active: this.link.active,
      status: this.link.status,
      focused: this.link.focused,
      name: this.link.name,
      imageId: this.link.imageId ?? Link.IMAGE_DEFAULT,
      imagePath: this.link.imagePath ?? Link.IMAGE_DEFAULT,
      categories: this.link.categories ?? [],
      description: this.link.description ?? '',
      timestamp: this.link.timestamp ?? '',
      source: this.sourceSelected ?? DEFAULT_SOURCE,
      sourceUrl: this.link.sourceUrl ?? '',
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.linkForm.controls['id'].setValue(this.link.id);
    this.linkForm.controls.source.setValue(this.sourceSelected);
  }

  onSelectionChanged(event: any): void {
    this.sourceSelected = event.value;
  }

  compareFunction(o1: ISource, o2: ISource): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  onResetForm(): void {
     this.linkForm.reset();
  }

  onSaveForm(): void {
    if (this.linkForm.valid) {

      this.link.timestamp = this.appointmentSrv.getTimestamp();
      this.link.source = this.sourceSelected;
      this.link.imageId = this.sourceSelected.imageId;
      this.link.imagePath = this.sourceSelected.imagePath;
      const link = { ...this.link, ...this.linkForm.value };

      this.logSrv.info(`link: ${JSON.stringify(this.link)}`);

      if (link.id === '0') {
          this.linksSrv.addLink(link);
      } else {
          this.linksSrv.updateLink(link);
      }

      this.router.navigate([ Link.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.linkForm.reset();
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, this.link.name);
    this.router.navigate([`/${Link.PATH_URL}`]);
  }

  gotoList(): void {
    this.linkForm.reset();
    this.router.navigate([`/${Link.PATH_URL}`]);
  }

  uploadImage(event): void {
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

              this.link.imageId = imageUrl;
              this.link.imagePath = imageUrl;

              // Update the data on the form
              this.linkForm.patchValue({
                imageId: this.link.imageId,
                imagePath: this.link.imagePath,
              });
          });
        })
     )
    .subscribe();
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
