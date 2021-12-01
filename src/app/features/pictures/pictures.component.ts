import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { IPicture } from '@models/picture';
import { PictureService } from '@services/pictures.service';
import { UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public pictures: IPicture[];
  public dataSource: MatTableDataSource<IPicture> = new MatTableDataSource();
  displayedColumns: string[] =  [ 'id', 'timestamp', 'image' ];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
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
}
