import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IBase } from '@models/base';

@Component({
  selector: 'app-base-item-dialog',
  templateUrl: './base-item-dialog.component.html',
})
export class BaseItemDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BaseItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public baseItem: IBase) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onViewClick(): void {
    this.dialogRef.close();
  }
}
