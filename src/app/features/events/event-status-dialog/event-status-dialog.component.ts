import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import { Status } from '@models/status.enum';
import { IEvent, Event } from '@models/event';

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
    @Inject(MAT_DIALOG_DATA) public data: IEvent) {
  }

  ngOnInit(): void {

    this.statusForm = this.fb.group({
      status: [ this.data.status, []],
      active: [ this.data.active, []],
      focused: [ this.data.focused, []],
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
      text: `El estado del evento ha sido modificado`,
      confirmButtonColor: '#003A59',
    });
    this.dialogRef.close(this.statusForm.value);
  }
}
