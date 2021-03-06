import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, combineLatest, Subscription } from 'rxjs';

import { EventService } from '@services/events.service';
import { LinksService } from '@services/links.services';
import { NoticeService } from '@services/notices.service';
import { LogService } from '@services/log.service';
import { ILink } from '@models/link';
import { INotice } from '@models/notice';
import { IEvent } from '@models/event';
import { IBase, BaseType, Base } from '@models/base';

@Component({
  selector: 'app-stories-panel',
  templateUrl: './stories-panel.component.html',
  styleUrls: ['./stories-panel.component.scss']
})
export class StoriesPanelComponent implements OnInit {

  private listOfObservers: Array<Subscription> = [];
  public links$: Observable<ILink[]>;
  public notices$: Observable<INotice[]>;
  public events$: Observable<IEvent[]>;
  public REAL_STORIES: IBase[];

  constructor(
    private router: Router,
    private logSrv: LogService,
    private noticesSrv: NoticeService,
    private linksSrv: LinksService,
    private eventsSrv: EventService,
  ) { }

  ngOnInit(): void {

    this.links$ = this.linksSrv.getAllLinks(true, true, 2);
    this.notices$ = this.noticesSrv.getAllNotices(true, true, 2);
    this.events$ = this.eventsSrv.getAllEvents(true, true, 2);

    const subs1$ = combineLatest([
      this.links$,
      this.notices$,
      this.events$,
    ])
    .subscribe(([links, notices, events]) => {

      this.REAL_STORIES = [];

      links.forEach(link => {
        this.REAL_STORIES.push({
          ...link,
          image: link.source.image,
          baseType: BaseType.LINK,
          // url: `../${Link.PATH_URL}/${link.id}`
        });
        // this.logSrv.info(`news item story! ${JSON.stringify(newsItem)}`);
      });

      notices.forEach(notice => {
        this.REAL_STORIES.push({
          ...notice,
          baseType: BaseType.NOTICE,
          // url: `../${Notice.PATH_URL}/${notice.id}`
        });
        // this.logSrv.info(`notice story! ${JSON.stringify(notice)}`);
      });

      events.forEach(event => {
        this.REAL_STORIES.push({
          ...event,
          baseType: BaseType.EVENT,
          // url: `../${Event.PATH_URL}/${event.id}`
        });
        // this.logSrv.info(`event story! ${JSON.stringify(event)}`);
      });

      this.REAL_STORIES = this.REAL_STORIES.sort((item1: IBase, item2: IBase) => {
        if (item1.timestamp > item2.timestamp) { return -1; }
        if (item1.timestamp < item2.timestamp) { return 1; }
        return 0;
      });

    });

    this.listOfObservers.push( subs1$ );
  }

  gotoItem(story: IBase): void {
    const baseItemUrl = Base.getUrl(story);
    this.router.navigate([`${baseItemUrl}`]);
  }

}
