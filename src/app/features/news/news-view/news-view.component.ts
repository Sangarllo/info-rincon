import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { INewsItem, NewsItem } from 'src/app/core/models/news';
import { NewsService } from '@services/news.services';
import { LogService } from '@services/log.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss']
})
export class NewsViewComponent implements OnInit {

  public idNewsItem: string;
  public newsItem: INewsItem;
  public urlNewsItem: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private logSrv: LogService,
    private newsSrv: NewsService,
  ) { }

  ngOnInit(): void {
    this.idNewsItem = this.route.snapshot.paramMap.get('id');
    if ( this.idNewsItem ) {
      // this.logSrv.info(`id asked ${this.idNewsItem}`);
      this.getDetails(this.idNewsItem);
    }
  }

  getDetails(idNewsItem: string): void {
    this.newsSrv.getOneNewsItem(idNewsItem)
      .subscribe( ( newsItem: INewsItem ) => {
        this.urlNewsItem = newsItem.sourceUrl;
        this.newsItem = newsItem;
        this.seo.generateTags({
          title: `${newsItem.name} | ${newsItem.source}`,
          description: newsItem.description,
          image: newsItem.image,
        });
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
