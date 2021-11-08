import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import { Base } from '@models/base';
import { IEvent } from '@models/event';
import { Category, EVENT_CATEGORIES } from '@models/category.enum';

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
    Swal.fire({
      icon: 'warning',
      title: 'Datos no modificados',
      text: `Has cerrado la ventana sin guardar ningún cambio`,
    });
    this.dialogRef.close();
  }

  save(): void {
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `La entidad ha sido cambiada correctamente`,
    });
    this.dialogRef.close(this.eventForm.value);
  }
}
