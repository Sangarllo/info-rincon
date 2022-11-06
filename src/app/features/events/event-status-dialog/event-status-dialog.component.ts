import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { environment } from '@environments/environment';
import { Status } from '@models/status.enum';
import { IEvent, Event } from '@models/event';
import { EventMode, EVENT_MODE_DEFAULT } from '@models/event-mode.enum';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-event-status-dialog',
  templateUrl: './event-status-dialog.component.html'
})
export class EventStatusDialogComponent implements OnInit {

  title = 'Configura el estado del evento';
  statusForm: UntypedFormGroup;

  public STATUS: Status[] = Event.STATUS;
  public EVENT_MODES: EventMode[] = Event.EVENT_MODES;
  public readonly N_DAYS_AHEAD = environment.nextStoriesNDaysAhead;

  constructor(
    private fb: UntypedFormBuilder,
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
      eventMode: [ this.data.eventMode || EVENT_MODE_DEFAULT, []],
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
