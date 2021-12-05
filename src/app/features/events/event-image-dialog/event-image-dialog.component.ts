import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Base } from '@models/base';
import { IPicture, Picture } from '@models/picture';
import { PictureService } from '@services/pictures.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-event-image-dialog',
  templateUrl: './event-image-dialog.component.html',
  styleUrls: ['./event-image-dialog.component.scss']
})
export class EventImageDialogComponent implements OnInit {

  readonly IMAGE_BLANK: string = Base.IMAGE_DEFAULT;
  readonly PICTURE_BLANK: IPicture = Picture.InitDefault();

  title = 'Configura la imagen del evento';
  pictureForm: FormGroup;

  pictureId: string;
  picturesIds: string[];

  pictureSelected: IPicture;
  pictures: IPicture[];

  uploadPercent: Observable<number>;

  constructor(
    public dialogRef: MatDialogRef<EventImageDialogComponent>,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private logSrv: LogService,
    private pictureSrv: PictureService,
    @Inject(MAT_DIALOG_DATA) public data: [string, string[]]) {
  }

  ngOnInit(): void {
    this.pictureId = this.data[0];
    this.picturesIds = this.data[1];

    console.log(`pictureId: ${JSON.stringify(this.pictureId)}`);
    console.log(`picturesIds: ${JSON.stringify(this.picturesIds.length)}`);

    if ( this.pictureId ) {
      this.getPictures();
    }
  }

  getPictures(): void {
    this.pictureSrv.getPictureFromImage(this.pictureId)
      .subscribe((picture: IPicture) => {
        this.pictureSelected = picture;
      });

    this.pictureSrv.getSeveralPicturesFromImages(this.picturesIds)
      .subscribe((pictures: IPicture[]) => {
        this.pictures = pictures;
      });
  }

  async uploadImage(event): Promise<void> {

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
            async ( imageUrl: string ) => {

              const thePicture = Picture.GeneratedByPath(imageUrl);
              this.pictureSelected = await this.pictureSrv.addPicture(thePicture);
              console.log(`new picture: ${JSON.stringify(this.pictureSelected)}`);

              this.pictures.push(this.pictureSelected);
          });
        })
     )
    .subscribe();
  }


  onSelectedImage(picture: IPicture): void {
    this.pictureSelected = picture;
  }

  deleteImage(): void {
    this.pictures = this.pictures.filter( (picture: IPicture) => picture.id !== this.pictureSelected.id );
    this.pictureSelected = this.pictures[0];
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

    const result: [IPicture, IPicture[]] = [
      this.pictureSelected,
      this.pictures
    ];

    this.dialogRef.close(result);
  }

}
