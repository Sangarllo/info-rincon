import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { INewsItem, NewsItem } from 'src/app/core/models/news';
import { NewsService } from '@services/news.services';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-news-dashboard',
  templateUrl: './news-dashboard.component.html'
})
export class NewsDashboardComponent implements OnInit {

  @Input() showHeader = true;
  public news$: Observable<INewsItem[]>;

  constructor(
    private router: Router,
    private utilSrv: UtilsService,
    private newsSrv: NewsService
  ) { }

  ngOnInit(): void {
    this.news$ = this.newsSrv.getAllNews(true, true, 5)
    .pipe(
      map((newsItems: INewsItem[]) => newsItems.map(newsItem => {

        newsItem.timestamp = this.utilSrv.getDistanceTimestamp(newsItem.timestamp);

        return { ...newsItem };
      }))
    );
  }


  gotoNewsItem(newsItem: INewsItem): void {
    this.router.navigate([`/${NewsItem.PATH_URL}/${newsItem.id}`]);
  }
}
