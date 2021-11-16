import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
    console.log(`opening ${JSON.stringify(data)}`);
    this.modeSelected = this.data.view;
    console.log(`modeSelected ${JSON.stringify(this.view)}`);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  returnOption(): void {
    console.log(`returnData1: ${JSON.stringify(this.modeSelected)}`);
    this.dialogRef.close(this.modeSelected);
  }
}
