import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';

import { UtilsService } from '@services/utils.service';
import { INotice } from '@models/notice';
import { IEvent } from '@models/event';
import { IBase } from '@models/base';
import { SeoService } from '@services/seo.service';
import { NoticeAlertedDialogComponent } from '@pages/dashboard/notice-alerted-dialog/notice-alerted-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public alertedNotice: INotice;
  public REAL_STORIES: IBase[];
  public dialogConfig = new MatDialogConfig();
  private listOfObservers: Array<Subscription> = [];

  constructor(
    public dialog: MatDialog,
    ) {
      this.dialogConfig.disableClose = true;
      this.dialogConfig.autoFocus = true;
      this.dialogConfig.width = '600px';
      this.dialogConfig.backdropClass = 'backdrop-dialog';
    }


  ngOnInit(): void {
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
