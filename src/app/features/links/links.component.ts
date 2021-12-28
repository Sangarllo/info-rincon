/* eslint-disable max-len */
  // eslint-disable-next-line max-len
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { LinksService } from '@services/links.services';
import { UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';
import { ILink, Link } from '@models/link';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public newsItems: ILink[];
  public dataSource: MatTableDataSource<ILink> = new MatTableDataSource();
  displayedColumns: string[] = [ 'status', 'id', 'timestamp', 'sourceImage', 'sourceName', 'collapsed-info', 'name', 'categories', 'actions4'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private linksSrv: LinksService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.linksSrv.getAllLinks(false, false) // TODO param based on userrole
      .pipe(
        map((newsItems) => newsItems.map(newsItem => {
          const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

          newsItem.description = ( newsItem.categories ) ? newsItem.categories.reduce(reducer, '') : '';

          newsItem.timestamp = this.utilSrv.getDistanceTimestamp(newsItem.timestamp);

          return { ...newsItem };
        }))
      )
      .subscribe( (newsItems: ILink[]) => {
        this.newsItems = newsItems;
        this.dataSource = new MatTableDataSource(this.newsItems);
        this.spinnerSvc.hide();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    // this.listOfObservers.push(subs1$); TODO Remove
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public gotoItem(link: ILink): void {
    this.router.navigate([`${Link.PATH_URL}/${link.id}`]);
  }

  public gotoUrl(link: ILink): void {

    const externalUrl = link.sourceUrl;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Si pulsas OK saldrás de la aplicación para ir a una dirección externa:<br/><br/><a href='${externalUrl}' style='color:red'>${externalUrl}</a>`,
      imageUrl: link.source.imagePath,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, acceder a la noticia'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(link.sourceUrl, '_blank');
      }
    });
  }

  public editItem(link: ILink): void {
    this.router.navigate([`${Link.PATH_URL}/${link.id}/editar`]);
  }

  public deleteItem(link: ILink): void {
    this.logSrv.info(`Borrando ${link.id}`);
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
        this.linksSrv.deleteLink(link);
        Swal.fire(
          '¡Borrada!',
          `${link.name} ha sido borrada`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`${Link.PATH_URL}/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
