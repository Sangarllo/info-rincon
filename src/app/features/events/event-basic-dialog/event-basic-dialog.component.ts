import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Base } from '@models/base';
import { IEvent } from '@models/event';
import { Category, EVENT_CATEGORIES } from '@models/category.enum';
import { SwalMessage, UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-event-basic-dialog',
  templateUrl: './event-basic-dialog.component.html'
})
export class EventBasicDialogComponent implements OnInit {

  title = 'Modifica los datos básicos del evento';
  eventForm: FormGroup;
  eventBaseSelected: Base;
  public CATEGORIES: Category[] = EVENT_CATEGORIES;
  readonly SECTION_BLANK: Base = Base.InitDefault();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventBasicDialogComponent>,
    private utilsSvc: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: IEvent) {
  }

  ngOnInit(): void {

    this.eventForm = this.fb.group({
      name: [ this.data.name, []],
      description: [ this.data.description, []],
      categories: [ this.data.categories, []],
      sanitizedUrl: [ this.data.sanitizedUrl, []],
    });
  }

   onNoClick(): void {
    this.utilsSvc.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();

  }

  save(): void {
    this.utilsSvc.swalFire(SwalMessage.OK_CHANGES, 'la entidad');
    this.dialogRef.close(this.eventForm.value);
  }
}
