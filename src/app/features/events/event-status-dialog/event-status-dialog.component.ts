import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Status } from '@models/status.enum';
import { IEvent, Event } from '@models/event';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-event-status-dialog',
  templateUrl: './event-status-dialog.component.html'
})
export class EventStatusDialogComponent implements OnInit {

  title = 'Configura el estado del evento';
  statusForm: FormGroup;

  public STATUS: Status[] = Event.STATUS;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventStatusDialogComponent>,
    private utilsSvc: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: IEvent) {
  }

  ngOnInit(): void {

    this.statusForm = this.fb.group({
      status: [ this.data.status, []],
      active: [ this.data.active, []],
      focused: [ this.data.focused, []],
      fixed: [ this.data.fixed, []],
  });
  }

   onNoClick(): void {
    this.utilsSvc.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, 'el estado');
    this.dialogRef.close(this.statusForm.value);
  }
}
