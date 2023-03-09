import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { INotice } from '@models/notice';

@Component({
  selector: 'app-notice-alerted-dialog',
  templateUrl: './notice-alerted-dialog.component.html'
})
export class NoticeAlertedDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoticeAlertedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public notice: INotice) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCloseClicked(): void {
    this.dialogRef.close();
  }

}
