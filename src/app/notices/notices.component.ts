import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { INotice } from '@models/notice';
import { NoticeService } from '@services/notices.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html'
})
export class NoticesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public notices: INotice[];
  public dataSource: MatTableDataSource<INotice> = new MatTableDataSource();
  displayedColumns: string[] =  [ 'status', 'id', 'timestamp', 'image', 'name', 'categories', 'actions3'];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private noticeSrv: NoticeService,
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.noticeSrv.getAllNotices( false, false ) // TODO param based on userrole
      .pipe(
        map((notices: INotice[]) => notices.map(notice => {

          const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

          notice.description = ( notice.categories ) ? notice.categories.reduce(reducer, '') : '';

          notice.timestamp = this.utilSrv.getDistanceTimestamp(notice.timestamp);

          return { ...notice };
        }))
      )
      .subscribe( (notices: INotice[]) => {
        this.notices = notices;
        this.dataSource = new MatTableDataSource(this.notices);
        this.loading = false;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public gotoItem(notice: INotice): void {
    this.router.navigate([`avisos/${notice.id}`]);
  }

  public editItem(notice: INotice): void {
    this.router.navigate([`avisos/${notice.id}/editar`]);
  }

  public deleteItem(notice: INotice): void {
    console.log(`Borrando ${notice.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticeSrv.deleteNotice(notice);
        Swal.fire(
          '¡Borrado!',
          `${notice.name} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`avisos/0/editar`]);
  }
}
