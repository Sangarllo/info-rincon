/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INewsItem, NewsItem } from '@models/news';
import { Status } from '@models/status.enum';
import { ISource, DEFAULT_SOURCE, NEWS_SOURCES } from '@models/source';
import { Category, NEWS_CATEGORIES } from '@models/category.enum';
import { AppointmentsService } from '@services/appointments.service';
import { NewsService } from '@services/news.services';
import { LogService } from '@services/log.service';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss']
})
export class NewsEditComponent implements OnInit, OnDestroy {

  newsItemForm!: UntypedFormGroup;
  pageTitle = 'Creación de una nueva noticia';
  errorMessage = '';
  sourceSelected: ISource;
  uploadPercent: Observable<number>;

  public newsItem!: INewsItem | undefined;
  public STATUS: Status[] = NewsItem.STATUS;
  public CATEGORIES: Category[] = NEWS_CATEGORIES;
  public SOURCES: ISource[] = NEWS_SOURCES;
  public urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private afStorage: AngularFireStorage,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private appointmentSrv: AppointmentsService,
    private newsSrv: NewsService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit(): void {

    const idNewsItem = this.route.snapshot.paramMap.get('id');
    if ( idNewsItem ) {
      this.logSrv.info(`id asked ${idNewsItem}`);
      this.getDetails(idNewsItem);
    }

    this.sourceSelected = DEFAULT_SOURCE;
    this.newsItemForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      status: [ Status.Editing, Validators.required],
      focused: true,
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
      image: NewsItem.IMAGE_DEFAULT,
      categories: null,
      description: '',
      timestamp: null,
      source: this.sourceSelected,
      sourceUrl: ['', [Validators.required, Validators.pattern(this.urlRegex)]]
    });
  }

  private getDetails(idNewsItem: string): void {
    this.logSrv.info(`id asked ${idNewsItem}`);

    if ( idNewsItem === '0' ) {
      this.pageTitle = 'Creación de una nueva noticia';
      this.newsItem = NewsItem.InitDefault();
    } else {

      const subs1$ = this.newsSrv.getOneNewsItem(idNewsItem)
      .subscribe({
        next: (newsItem: INewsItem | undefined) => {
          this.newsItem = newsItem;
          this.displayNewsItem();
          this.logSrv.info(JSON.stringify(this.newsItem));
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });

      this.listOfObservers.push(subs1$);
    }
  }

  displayNewsItem(): void {

    if (this.newsItemForm) {
      this.newsItemForm.reset();
    }

    if (this.newsItem.id === '0') {
      this.pageTitle = 'Creando una nueva noticia';
    } else {
      this.pageTitle = `Editando la noticia ${this.newsItem.name}`;
    }

    this.sourceSelected = this.newsItem.source;

    // Update the data on the form
    this.newsItemForm.patchValue({
      id: this.newsItem.id,
      active: this.newsItem.active,
      status: this.newsItem.status,
      focused: this.newsItem.focused,
      name: this.newsItem.name,
      imageId: this.newsItem.imageId ?? NewsItem.IMAGE_DEFAULT,
      imagePath: this.newsItem.imagePath ?? NewsItem.IMAGE_DEFAULT,
      categories: this.newsItem.categories ?? [],
      description: this.newsItem.description ?? '',
      timestamp: this.newsItem.timestamp ?? '',
      source: this.sourceSelected ?? DEFAULT_SOURCE,
      sourceUrl: this.newsItem.sourceUrl ?? '',
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.newsItemForm.controls['id'].setValue(this.newsItem.id);
    this.newsItemForm.controls.source.setValue(this.sourceSelected);
  }

  onSelectionChanged(event: any): void {
    this.sourceSelected = event.value;
  }

  compareFunction(o1: ISource, o2: ISource): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  onResetForm(): void {
     this.newsItemForm.reset();
  }

  onSaveForm(): void {
    if (this.newsItemForm.valid) {

      this.newsItem.timestamp = this.appointmentSrv.getTimestamp();
      this.newsItem.source = this.sourceSelected;
      this.newsItem.imageId = this.sourceSelected.imageId;
      this.newsItem.imagePath = this.sourceSelected.imagePath;
      const newsItem = { ...this.newsItem, ...this.newsItemForm.value };

      this.logSrv.info(`newsItem: ${JSON.stringify(this.newsItem)}`);

      if (newsItem.id === '0') {
          this.newsSrv.addNewsItem(newsItem);
      } else {
          this.newsSrv.updateNewsItem(newsItem);
      }

      this.router.navigate([ NewsItem.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  onSaveComplete(): void {
    this.newsItemForm.reset();
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, this.newsItem.name);
    this.router.navigate([`/${NewsItem.PATH_URL}`]);
  }

  gotoList(): void {
    this.newsItemForm.reset();
    this.router.navigate([`/${NewsItem.PATH_URL}`]);
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

              this.newsItem.imageId = imageUrl;
              this.newsItem.imagePath = imageUrl;

              // Update the data on the form
              this.newsItemForm.patchValue({
                imageId: this.newsItem.imageId,
                imagePath: this.newsItem.imagePath
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
