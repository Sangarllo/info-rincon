import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';

import { Subscription } from 'rxjs';

import { IPicture } from '@models/picture';
import { PictureService } from '@services/pictures.service';
import { SwalMessage, UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';
import { PictureInfoDialogComponent } from '@features/pictures/picture-info-dialog/picture-info-dialog.component';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public dialogConfig = new MatDialogConfig();
  public pictures: IPicture[];
  public dataSource: MatTableDataSource<IPicture> = new MatTableDataSource();
  displayedColumns: string[] =  [ 'id', 'timestamp', 'image', 'actions'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    private utilsSrv: UtilsService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private pictureSrv: PictureService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.pictureSrv.getAllPictures( )
      .subscribe( (pictures: IPicture[]) => {
        this.pictures = pictures;
        console.log(`pictures: ${JSON.stringify(pictures)}`);
        this.dataSource = new MatTableDataSource(this.pictures);
        this.spinnerSvc.hide();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.listOfObservers.push(subs1$);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  openPictureDialog(picture: IPicture): void {
    this.dialogConfig.data = picture;
    const dialogRef = this.dialog.open(PictureInfoDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe((message: string) => {
      if ( message ) {
          this.utilsSrv.swalFire(
              SwalMessage.OTHER_CHANGES,
              `La imagen ha sido borrada: ${message}`
          );
      } else {
          this.utilsSrv.swalFire(
              SwalMessage.OTHER_CHANGES,
              'La imagen no ha sido borrada'
          );
      }
    });
  }
}
