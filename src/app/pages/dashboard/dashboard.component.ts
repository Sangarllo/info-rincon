import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable, combineLatest, Subscription } from 'rxjs';

import { EventService } from '@services/events.service';
import { LinksService } from '@services/links.services';
import { NoticeService } from '@services/notices.service';
import { UtilsService } from '@services/utils.service';
import { ILink, Link } from '@models/link';
import { INotice, Notice } from '@models/notice';
import { Event, IEvent } from '@models/event';
import { IBase, BaseType } from '@models/base';
import { SeoService } from '@services/seo.service';
import { NoticeAlertedDialogComponent } from '@pages/dashboard/notice-alerted-dialog/notice-alerted-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
  public alertedNotice: INotice;
  public links$: Observable<ILink[]>;
  public notices$: Observable<INotice[]>;
  public events$: Observable<IEvent[]>;

  public realStories$: Observable<IBase[]>;
  public REAL_STORIES: IBase[];

  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private utilSrv: UtilsService,
    private noticesSrv: NoticeService,
    private linksSrv: LinksService,
    private eventsSrv: EventService,
    private seo: SeoService
    ) {
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '600px';
      this.dialogConfig.backdropClass = 'backdrop-dialog';
    }


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

  ngAfterViewInit(): void {

    let done = false;
    console.log(`ngAfterViewInit`);

    const subs2$ = this.noticesSrv.getAlertedNotice()
      .subscribe( (notices) => {

        if ( done ) {
          return;
        }

        const alertedNotices = notices.filter( notice => notice.alerted === true );
        if ( alertedNotices.length === 1 ) {
          this.alertedNotice = alertedNotices[0];
          console.log(`Alerted Notice: ${this.alertedNotice.name}`);
          this.openAlertedNotice(this.alertedNotice);
          done = true;
        }
      }
    );

    this.listOfObservers.push( subs2$ );
  }

  openAlertedNotice(notice: INotice): void {
    this.dialogConfig.data = notice;
    const dialogRef = this.dialog.open(
      NoticeAlertedDialogComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe((eventDialog: IEvent) => {
      console.log('Cerrado dialog');
    });
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
