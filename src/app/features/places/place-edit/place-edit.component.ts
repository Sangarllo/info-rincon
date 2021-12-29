import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Place, IPlace } from '@models/place';
import { PlaceType, PLACE_TYPES } from '@models/place-type.enum';
import { PlaceService } from '@services/places.service';
import { LogService } from '@services/log.service';
import sub from 'date-fns/sub';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.component.html',
  styleUrls: ['./place-edit.component.scss']
})
export class PlaceEditComponent implements OnInit, OnDestroy {

  placeForm!: FormGroup;
  pageTitle = 'Creación de un nuevo lugar';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public place!: IPlace | undefined;
  public TYPES: PlaceType[] = PLACE_TYPES;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private placeSrv: PlaceService) { }

  ngOnInit(): void {

    const idPlace = this.route.snapshot.paramMap.get('id');
    if ( idPlace ) {
      this.logSrv.info(`id asked ${idPlace}`);
      this.getDetails(idPlace);
    }

    this.placeForm = this.fb.group({
      id: [{value: '0', disabled: true}],
      active: true,
      name: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      imageId: Place.IMAGE_DEFAULT,
      imagePath: Place.IMAGE_DEFAULT,
      types: [],
      locality: Place.LOCALITY_DEFAULT
    });

  }

  getDetails(idPlace: string): void {
    this.logSrv.info(`id asked ${idPlace}`);

    if ( idPlace === '0' ) {
      this.pageTitle = 'Creación de un nuevo lugar';
      this.place = Place.InitDefault();
    } else {
      const subs1$ = this.placeSrv.getOnePlace(idPlace)
        .subscribe({
            next: (place: IPlace | undefined) => {
              this.place = place;
              this.displayPlace();
              this.logSrv.info(JSON.stringify(this.place));
            },
            error: err => {
              this.errorMessage = `Error: ${err}`;
            }
      });

      this.listOfObservers.push(subs1$);
    }
  }


  displayPlace(): void {

    if (this.placeForm) {
      this.placeForm.reset();
    }

    if (this.place.id === '0') {
      this.pageTitle = 'Creando un nuevo lugar';
    } else {
      this.pageTitle = `Editando el lugar ${this.place.name}`;
    }

    // Update the data on the form
    this.placeForm.patchValue({
      id: this.place.id,
      active: this.place.active,
      name: this.place.name,
      imageId: this.place.imageId ?? Place.IMAGE_DEFAULT,
      imagePath: this.place.imagePath ?? Place.IMAGE_DEFAULT,
      types: this.place.types ?? [],
      locality: this.place.locality
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.placeForm.controls['id'].setValue(this.place.id);
  }

  onResetForm(): void {
     this.placeForm.reset();
  }

  onSaveForm(): void {
    if (this.placeForm.valid) {

        const placeItem = { ...this.place, ...this.placeForm.value };

        if (placeItem.id === '0') {
          this.placeSrv.addPlace(placeItem);
        } else {
          this.placeSrv.updatePlace(placeItem);
        }

        this.router.navigate([ Place.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.placeForm.reset();
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `Los datos de ${this.place.name} se han guardado correctamente`,
      // footer: '<a href>Why do I have this issue?</a>'
    });
    this.router.navigate([`/${Place.PATH_URL}`]);
  }

  gotoList(): void {
    this.placeForm.reset();
    this.router.navigate([`/${Place.PATH_URL}`]);
  }

  uploadImage(event): void {
    const file = event.target.files[0];
    const filePath = file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent =  task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            ( imageUrl: string ) => {

              this.place.imageId = imageUrl;
              this.place.imagePath = imageUrl;

              // Update the data on the form
              this.placeForm.patchValue({
                imageId: this.place.imageId,
                imagePath: this.place.imagePath,
              });
          });
        })
     )
    .subscribe();
  }

  ngOnDestroy(): void {
    // eslint-disable-next-line no-shadow
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
