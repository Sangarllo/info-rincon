import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { INotice } from '@models/notice';
import { NoticeService } from '@services/notices.service';
import { PictureService } from '@services/pictures.service';
import { UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'cards';
  public loading = true;
  public notices: INotice[];
  public dataSource: MatTableDataSource<INotice> = new MatTableDataSource();
  displayedColumns: string[] =  [ 'status', 'id', 'timestamp', 'image', 'collapsed-info', 'name', 'categories', 'actions4'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private noticeSrv: NoticeService,
    private pictureSrv: PictureService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.noticeSrv.getAllNotices( false, false ) // TODO param based on userrole
      .pipe(
        map((notices: INotice[]) => notices.map(notice => {

          const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

          notice.extra = ( notice.categories ) ? notice.categories.reduce(reducer, '') : '';

          notice.timestamp = this.utilSrv.getDistanceTimestamp(notice.timestamp);

          return { ...notice };
        }))
      )
      .subscribe( (notices: INotice[]) => {
        this.notices = notices;
        this.dataSource = new MatTableDataSource(this.notices);
        this.spinnerSvc.hide();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.listOfObservers.push(subs1$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getThumbnail(image: string): string {
    return this.pictureSrv.getThumbnail(image);
  }

  public gotoItem(notice: INotice): void {
    this.router.navigate([`avisos/${notice.id}`]);
  }

  public gotoItemConfig(notice: INotice): void {
    this.router.navigate([`avisos/${notice.id}/editar`]);
  }

  public deleteItem(notice: INotice): void {
    this.logSrv.info(`Borrando ${notice.id}`);
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
        Swal.fire({
          title: '¡Borrado!',
          text: `${notice.name} ha sido borrado`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
      }
    });
  }

  public alertItem(notice): void {

    let done = false;

    if ( !notice.alerted ) { // Is new alerted
      let oldAlertedNotice: INotice;
      const subs2$ = this.noticeSrv.getAlertedNotice()
        .subscribe((alertedNotices) => {

          if ( done ) {
            return;
          }

          console.log(`AlertedNotices: ${alertedNotices.length}`);
          switch(alertedNotices.length) {

            case 0: {
              notice.alerted = true;
              Swal.fire({
                title: 'Cambiado!',
                text: `${notice.name} se mostrará ahora como alerta`,
                icon: 'success',
                confirmButtonColor: '#003A59',
              });
              done = true;
              this.noticeSrv.updateNotice(notice);
              break;
            }

            case  1: {
              oldAlertedNotice = alertedNotices[0];
              Swal.fire({
                title: '¿Estás seguro?',
                text: `El aviso ${oldAlertedNotice.name} dejará de mostrarse como alerta`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Sí, cambiar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  oldAlertedNotice.alerted = false;
                  this.noticeSrv.updateNotice(oldAlertedNotice);
                  notice.alerted = true;
                  Swal.fire({
                    title: '¡Cambiado!',
                    text: `${notice.name} se mostrará ahora como alerta`,
                    icon: 'success',
                    confirmButtonColor: '#003A59',
                  });
                  done = true;
                  this.noticeSrv.updateNotice(notice);
                }
              });
              break;
            }

            default: {
              Swal.fire({
                title: 'Ups, el cambio no fue realizado!',
                text: `Avisa al administrador ya que hay más de un aviso mostrados como alerta`,
                icon: 'error'
              });
              done = true;
            }

          };
        });

        this.listOfObservers.push( subs2$ );
      } else { // Desactivado como alertado

        Swal.fire({
          title: '¿Estás seguro?',
          text: `El aviso ${notice.name} dejará de mostrarse como alerta`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Sí, cambiar!'
        }).then((result) => {
          if (result.isConfirmed) {
            notice.alerted = false;
            Swal.fire({
              title: 'Cambiado!',
              text: `${notice.name} ya no es mostrado como alertas`,
              icon: 'success',
              confirmButtonColor: '#003A59',
            });
            done = true;
            this.noticeSrv.updateNotice(notice);
          }
        });

      }

      console.log(`HECHO!`);
      return;
    // notice.alerted = !notice.alerted;
  }

  public addItem(): void {
    this.router.navigate([`avisos/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
