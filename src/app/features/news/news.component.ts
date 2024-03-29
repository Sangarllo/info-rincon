/* eslint-disable max-len */
  // eslint-disable-next-line max-len
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { INewsItem, NewsItem } from '@models/news';
import { NewsService } from '@services/news.services';
import { UtilsService } from '@services/utils.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public newsItems: INewsItem[];
  public dataSource: MatTableDataSource<INewsItem> = new MatTableDataSource();
  displayedColumns: string[] = [ 'status', 'id', 'timestamp', 'sourceImage', 'sourceName', 'collapsed-info', 'name', 'categories', 'actions4'];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private logSrv: LogService,
    private spinnerSvc: SpinnerService,
    private newsSrv: NewsService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.newsSrv.getAllNews(false, false) // TODO param based on userrole
      .pipe(
        map((newsItems) => newsItems.map(newsItem => {
          const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

          newsItem.description = ( newsItem.categories ) ? newsItem.categories.reduce(reducer, '') : '';

          newsItem.timestamp = this.utilSrv.getDistanceTimestamp(newsItem.timestamp);

          return { ...newsItem };
        }))
      )
      .subscribe( (newsItems: INewsItem[]) => {
        this.newsItems = newsItems;
        this.dataSource = new MatTableDataSource(this.newsItems);
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

  public gotoItem(newsItem: INewsItem): void {
    this.router.navigate([`${NewsItem.PATH_URL}/${newsItem.id}`]);
  }

  public gotoUrl(newsItem: INewsItem): void {

    const externalUrl = newsItem.sourceUrl;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Si pulsas OK saldrás de la aplicación para ir a una dirección externa:<br/><br/><a href='${externalUrl}' style='color:red'>${externalUrl}</a>`,
      imageUrl: newsItem.source.imagePath,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, acceder a la noticia'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(newsItem.sourceUrl, '_blank');
      }
    });
  }

  public editItem(newsItem: INewsItem): void {
    this.router.navigate([`${NewsItem.PATH_URL}/${newsItem.id}/editar`]);
  }

  public deleteItem(newsItem: INewsItem): void {
    this.logSrv.info(`Borrando ${newsItem.id}`);
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
        this.newsSrv.deleteNewsItem(newsItem);
        Swal.fire({
          title: '¡Borrada!',
          text: `${newsItem.name} ha sido borrada`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`${NewsItem.PATH_URL}/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
