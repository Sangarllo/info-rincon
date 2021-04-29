import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Base } from 'src/app/core/models/base';
import { IEvent } from 'src/app/core/models/event';
import { EntityService } from '@services/entities.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-event-image-dialog',
  templateUrl: './event-image-dialog.component.html',
  styleUrls: ['./event-image-dialog.component.scss']
})
export class EventImageDialogComponent implements OnInit {

  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;

  title = 'Selecciona la imagen del evento';
  imageForm: FormGroup;
  imageSelected: string; // TODO: image must be IImage
  uploadPercent: Observable<number>;

  // entities$: Observable<Base[]>;

  constructor(
    public dialogRef: MatDialogRef<EventImageDialogComponent>,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private logSrv: LogService,
    private entitySrv: EntityService,
    @Inject(MAT_DIALOG_DATA) public data: IEvent) {
  }

  uploadImage(event): void {

    this.logSrv.info(`adding other image`);
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
              this.imageSelected = imageUrl;
              this.data.image = imageUrl;
              this.data.images.push(imageUrl);
          });
        })
     )
    .subscribe();
  }


  onSelectedImage(path: string): void {
    this.imageSelected = path;
    this.data.image = path;
  }

  deleteImage(): void {
    this.data.images = this.data.images.filter( (image: string) => image !== this.imageSelected );
    this.imageSelected = this.IMAGE_BLANK;
    this.data.image = this.IMAGE_BLANK;
  }

  ngOnInit(): void {

    this.imageSelected = this.data.image ??
    this.IMAGE_BLANK;

    this.imageForm = this.fb.group({
      image: [ this.imageSelected, []],
      images: [ this.data.images, []],
  });
  }

  onNoClick(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Datos no modificados',
      text: `Has cerrado la ventana sin guardar ningún cambio`,
    });
    this.dialogRef.close();
  }

  save(): void {
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `La imagen ha sido cambiada correctamente`,
    });
    this.imageForm.controls.image.setValue(this.imageSelected);
    this.imageForm.controls.images.setValue(this.data.images);
    this.dialogRef.close(this.imageForm.value);
  }
}
