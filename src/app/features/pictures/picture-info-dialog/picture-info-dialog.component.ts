import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { IPicture, Picture } from '@models/picture';
import { IEvent } from '@models/event';
import { AuditType } from '@models/audit';
import { EventService } from '@services/events.service';
import { PictureService } from '@services/pictures.service';
import { SwalMessage, UtilsService } from '@services/utils.service';

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
    private utilsSvc: UtilsService,
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
    this.utilsSvc.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  remove(): void {
    this.pictureSrv.deletePicture(this.picture);
    const message = 'Success!';
    this.dialogRef.close(message);
  }

  removePicture(event: IEvent): void {
    event.images = event.images.filter(imageId => imageId !== this.picture.id);
    event.imageId = ( this.picture.id === event.imageId ) ? Picture.IMAGE_DEFAULT : event.imageId;
    event.imagePath = ( this.picture.path === event.imagePath ) ? Picture.IMAGE_DEFAULT : event.imagePath;

    this.eventSrv.updateEvent(event, AuditType.UPDATED_STATUS );
  }

}
