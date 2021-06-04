import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IBase } from '@models/base';


@Component({
  selector: 'app-event-item-dialog',
  templateUrl: './event-item-dialog.component.html',
  styleUrls: ['./event-item-dialog.component.scss']
})
export class EventItemDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EventItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public eventItem: IBase) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onViewClick(): void {
    this.dialogRef.close();
  }
}
