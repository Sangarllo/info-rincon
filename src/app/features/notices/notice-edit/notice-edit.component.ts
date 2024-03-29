import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Notice, INotice } from '@models/notice';
import { Status } from '@models/status.enum';
import { NOTICE_CATEGORIES, Category } from '@models/category.enum';
import { AppointmentsService } from '@services/appointments.service';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.component.html',
  styleUrls: ['./notice-edit.component.scss']
})
export class NoticeEditComponent implements OnInit, OnDestroy {

  noticeForm!: UntypedFormGroup;
  pageTitle = 'Creación de un nuevo aviso';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public notice!: INotice | undefined;
  public noticeId: string;
  public STATUS: Status[] = Notice.STATUS;
  public CATEGORIES: Category[] = NOTICE_CATEGORIES;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private afStorage: AngularFireStorage,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private appointmentSrv: AppointmentsService,
    private NoticeSrv: NoticeService,
    private utilsSvc: UtilsService,
) { }

  public ngOnInit(): void {

    this.noticeId = this.route.snapshot.paramMap.get('id');
    if ( this.noticeId ) {
      this.logSrv.info(`id asked ${this.noticeId}`);
      this.getDetails(this.noticeId);
    }

    this.noticeForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      status: [ Status.Editing, Validators.required],
      focused: true,
      alerted: false, // [{value: false, disabled: true}],
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      imageId: Notice.IMAGE_DEFAULT,
      imagePath: Notice.IMAGE_DEFAULT,
      thumbnailImg: Notice.IMAGE_DEFAULT,
      categories: null,
      description: '',
      timestamp: null
    });
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  public onResetForm(): void {
     this.noticeForm.reset();
  }

  public onSaveForm(): void {
    if (this.noticeForm.valid) {

      this.notice.timestamp = this.appointmentSrv.getTimestamp();
      const noticeItem = { ...this.notice, ...this.noticeForm.value };

      if (noticeItem.id === '0') {
          this.NoticeSrv.addNotice(noticeItem);
      } else {
          this.NoticeSrv.updateNotice(noticeItem);
      }

      this.router.navigate([ Notice.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  public onSaveComplete(): void {
    // Reset the form to clear the flags
    this.noticeForm.reset();
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, this.notice.name);
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public gotoList(): void {
    this.noticeForm.reset();
    this.router.navigate([`/${Notice.PATH_URL}`]);
  }

  public gotoItem(): void {
    this.router.navigate([`/${Notice.PATH_URL}/${this.noticeId}`]);
  }

  public uploadImage(event): void {
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

              this.notice.imageId = imageUrl;
              this.notice.imagePath = imageUrl;
              this.notice.thumbnailImg = this.resizedName(imageUrl);

              // Update the data on the form
              this.noticeForm.patchValue({
                imageId: this.notice.imageId,
                imagePath: this.notice.imagePath,
                thumbnailImg: this.notice.thumbnailImg,
              });
          });
        })
     )
    .subscribe();
  }

  private getDetails(idNotice: string): void {
    this.logSrv.info(`id asked ${idNotice}`);

    if ( idNotice === '0' ) {
      this.pageTitle = 'Creación de un nuevo aviso';
      this.notice = Notice.InitDefault();
    } else {
      const subs$1 = this.NoticeSrv.getOneNotice(idNotice)
      .subscribe({
        next: (notice: INotice | undefined) => {
          this.notice = notice;
          this.displayNotice();
          this.logSrv.info(JSON.stringify(this.notice));
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });

      this.listOfObservers.push(subs$1);
    }
  }

  private displayNotice(): void {

    if (this.noticeForm) {
      this.noticeForm.reset();
    }

    if (this.notice.id === '0') {
      this.pageTitle = 'Creando un nuevo aviso';
    } else {
      this.pageTitle = `Editando el aviso ${this.notice.name}`;
    }

    // Update the data on the form
    this.noticeForm.patchValue({
      id: this.notice.id,
      active: this.notice.active,
      status: this.notice.status,
      focused: this.notice.focused,
      alerted: this.notice.alerted,
      name: this.notice.name,
      imageId: this.notice.imageId ?? Notice.IMAGE_DEFAULT,
      imagePath: this.notice.imagePath ?? Notice.IMAGE_DEFAULT,
      thumbnailImg: this.notice.thumbnailImg ?? Notice.IMAGE_DEFAULT,
      categories: this.notice.categories ?? [],
      description: this.notice.description ?? '',
      timestamp: this.notice.timestamp ?? '',
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.noticeForm.controls['id'].setValue(this.notice.id);
  }

  private resizedName(fileName, dimensions = '200x200'): string {
    const extIndex = fileName.lastIndexOf('.');
    const ext = fileName.substring(extIndex);
    return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
  }
}
