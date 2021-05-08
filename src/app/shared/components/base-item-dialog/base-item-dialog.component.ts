import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IBase } from '@models/base';

@Component({
  selector: 'app-base-item-dialog',
  templateUrl: './base-item-dialog.component.html',
  styleUrls: ['./base-item-dialog.component.scss']
})
export class BaseItemDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BaseItemDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public baseItem: IBase) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  gotoBase(): void {
    this.dialogRef.close();
    this.router.navigate([`eventos/${this.baseItem.id}`]);
  }
}
