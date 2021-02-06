import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { INewsItem, NewsItem } from '@models/news';
import { NewsService } from '@services/news.services';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public newsItems: INewsItem[];
  public dataSource: MatTableDataSource<INewsItem> = new MatTableDataSource();
  displayedColumns: string[] = [ 'status', 'id', 'timestamp', 'sourceImage', 'sourceName', 'name', 'categories', 'actions4'];

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private newsSrv: NewsService,
  ) { }

  ngOnInit(): void {
    this.newsSrv.getAllNews(false, false) // TODO param based on userrole
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

  public gotoItem(newsItem: INewsItem): void {
    this.router.navigate([`${NewsItem.PATH_URL}/${newsItem.id}`]);
  }

  public gotoUrl(newsItem: INewsItem): void {

    const externalUrl = newsItem.sourceUrl;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Si pulsas OK saldrás de la aplicación para ir a una dirección externa:<br/><br/><a href='${externalUrl}' style='color:red'>${externalUrl}</a>`,
      imageUrl: newsItem.source.image,
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
    console.log(`Borrando ${newsItem.id}`);
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
        Swal.fire(
          '¡Borrada!',
          `${newsItem.name} ha sido borrada`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`${NewsItem.PATH_URL}/0/editar`]);
  }
}
