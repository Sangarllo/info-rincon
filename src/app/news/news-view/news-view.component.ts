import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { INewsItem, NewsItem } from '@shared/models/news';
import { NewsService } from '@services/news.services';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss']
})
export class NewsViewComponent implements OnInit {

  public newsItem$: Observable<INewsItem | undefined> | null = null;
  public idNewsItem: string;
  public urlNewsItem: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsSrv: NewsService,
  ) { }

  ngOnInit(): void {
    this.idNewsItem = this.route.snapshot.paramMap.get('id');
    if ( this.idNewsItem ) {
      // console.log(`id asked ${this.idNewsItem}`);
      this.getDetails(this.idNewsItem);
    }
  }

  getDetails(idNewsItem: string): void {
    // console.log(`id asked ${idNewsItem}`);
    this.newsItem$ = this.newsSrv.getOneNewsItem(idNewsItem);

    this.newsItem$
      .subscribe( ( newsItem: INewsItem ) => {
        this.urlNewsItem = newsItem.sourceUrl;
      });
  }

  public gotoUrl(): void {
    window.open(this.urlNewsItem, '_blank');
  }

  public gotoList(): void {
    this.router.navigate([`/${NewsItem.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${NewsItem.PATH_URL}/${this.idNewsItem}/editar`]);
  }
}
