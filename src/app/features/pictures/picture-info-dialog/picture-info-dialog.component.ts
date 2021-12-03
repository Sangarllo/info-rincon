import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

import { IPicture, Picture } from '@models/picture';
import { IEvent } from '@models/event';
import { AuditType } from '@models/audit';
import { EventService } from '@services/events.service';
import { PictureService } from '@services/pictures.service';

@Component({
  selector: 'app-picture-info-dialog',
  templateUrl: './picture-info-dialog.component.html',
  styleUrls: ['./picture-info-dialog.component.scss']
})
export class PictureInfoDialogComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  title = 'Información de la imágen';
  picturePath: string;

  public events: IEvent[];
  public dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
  displayedColumns: string[] = [
      'status', 'name', 'active', 'actions'
  ];

  constructor(
    public dialogRef: MatDialogRef<PictureInfoDialogComponent>,
    public pictureSrv: PictureService,
    public eventSrv: EventService,
    @Inject(MAT_DIALOG_DATA) public picture: IPicture) {
  }

  ngOnInit(): void {
      console.log(`data in dialog: ${JSON.stringify(this.picture)}`);
      this.picturePath = this.picture.path;
      const imagePath = this.picture.path;
      console.log(`imagePath: ${imagePath}`);

      const imageId = this.picture.id;
      console.log(`imageId: ${imageId}`);

      this.eventSrv.getAllEventsByImage(this.picture.id)
      .subscribe( (events: IEvent[]) => {
          this.events = events;
          this.dataSource = new MatTableDataSource(this.events);
          // this.spinnerSvc.hide();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  remove(): void {
    this.pictureSrv.deletePicture(this.picture);
    const message = 'Success!';
    this.dialogRef.close(message);
  }

  removePicture(event: IEvent): void {
    event.images = event.images.filter(imageId => imageId !== this.picture.id);
    event.image = ( this.picture.id === event.image ) ? Picture.IMAGE_DEFAULT : event.image;

    this.eventSrv.updateEvent(event, AuditType.UPDATED_STATUS );
  }

}