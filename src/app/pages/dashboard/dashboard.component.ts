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

  public realStories$: Observable<IBase[]>;
  public REAL_STORIES: IBase[];

  public dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
    private utilSrv: UtilsService,
    private seo: SeoService
    ) {
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '600px';
      this.dialogConfig.backdropClass = 'backdrop-dialog';
    }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    // TODO: temporal disable of alerted notice

    // let done = false;
    // console.log(`ngAfterViewInit`);

    // const subs2$ = this.noticesSrv.getAlertedNotice()
    //   .subscribe( (notices) => {

    //     if ( done ) {
    //       return;
    //     }

    //     const alertedNotices = notices.filter( notice => notice.alerted === true );
    //     if ( alertedNotices.length === 1 ) {
    //       this.alertedNotice = alertedNotices[0];
    //       console.log(`Alerted Notice: ${this.alertedNotice.name}`);
    //       this.openAlertedNotice(this.alertedNotice);
    //       done = true;
    //     }
    //   }
    // );

    // this.listOfObservers.push( subs2$ );
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
