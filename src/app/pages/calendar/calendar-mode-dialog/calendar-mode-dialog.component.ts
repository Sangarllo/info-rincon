import { Component, Inject } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-mode-dialog',
  templateUrl: './calendar-mode-dialog.component.html',
  styleUrls: ['./calendar-mode-dialog.component.scss']
})
export class CalendarModeDialogComponent {

  CalendarView = CalendarView;
  public modeSelected: string;
  view: CalendarView;

  constructor(
    public dialogRef: MatDialogRef<CalendarModeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // DialogData,
  ) {
    switch ( data.view ) {
      case 'day':
          this.modeSelected = 'CalendarView.Day';
          break;
      case 'week':
          this.modeSelected = 'CalendarView.Week';
          break;
      case 'month':
      default:
          this.modeSelected = 'CalendarView.Month';
          break;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    const result: string = this.modeSelected;
    this.dialogRef.close(result);
  }
}
