import { Component, OnInit } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EventService } from '@services/events.service';
import { NewsService } from '@services/news.services';
import { NoticeService } from '@services/notices.service';
import { UtilsService } from '@services/utils.service';
import { INewsItem, NewsItem } from '@models/news';
import { INotice, Notice } from '@models/notice';
import { Event, IEvent } from '@models/event';
import { IBase, BaseType } from '@models/base';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public news$: Observable<INewsItem[]>;
  public notices$: Observable<INotice[]>;
  public events$: Observable<IEvent[]>;

  public realStories$: Observable<IBase[]>;
  public REAL_STORIES: IBase[];

  constructor(
    private utilSrv: UtilsService,
    private noticesSrv: NoticeService,
    private newsSrv: NewsService,
    private eventsSrv: EventService,
    private seo: SeoService
  ) { }


  ngOnInit(): void {

    this.news$ = this.newsSrv.getAllNews(true, true, 2);
    this.notices$ = this.noticesSrv.getAllNotices(true, true, 2);
    this.events$ = this.eventsSrv.getAllEvents(true, true, 2);

    combineLatest([
      this.news$,
      this.notices$,
      this.events$,
    ])
    .subscribe(([news, notices, events]) => {

      this.REAL_STORIES = [];

      news.forEach(newsItem => {
        this.REAL_STORIES.push({
          ...newsItem,
          image: newsItem.source.image,
          baseType: BaseType.NEWS_ITEM,
          url: `../${NewsItem.PATH_URL}/${newsItem.id}`
        });
        // console.log(`news item story! ${JSON.stringify(newsItem)}`);
      });

      notices.forEach(notice => {
        this.REAL_STORIES.push({
          ...notice,
          baseType: BaseType.NOTICE,
          url: `../${Notice.PATH_URL}/${notice.id}`
        });
        // console.log(`notice story! ${JSON.stringify(notice)}`);
      });

      events.forEach(event => {
        this.REAL_STORIES.push({
          ...event,
          baseType: BaseType.EVENT,
          url: `../${Event.PATH_URL}/${event.id}`
        });
        // console.log(`event story! ${JSON.stringify(event)}`);
      });

      this.REAL_STORIES = this.REAL_STORIES.sort((item1: IBase, item2: IBase) => {
        if (item1.timestamp > item2.timestamp) { return -1; }
        if (item1.timestamp < item2.timestamp) { return 1; }
        return 0;
      });

    });
  }
}
