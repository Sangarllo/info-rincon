import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { BaseService } from '@services/base.service';

@Component({
  selector: 'app-calendar-entities-dialog',
  templateUrl: './calendar-entities-dialog.component.html',
  styleUrls: ['./calendar-entities-dialog.component.scss']
})
export class CalendarEntitiesDialogComponent {

  readonly SECTION_BLANK: Base = Base.InitDefault();
  baseItemName: string;
  baseItemDesc: string;
  baseItemForm: FormGroup;
  baseItemCtrl = new FormControl();
  baseItemSelected: IBase;
  baseItems$: Observable<IBase[]>;
  favEntities: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CalendarEntitiesDialogComponent>,
    private baseSrv: BaseService,
    @Inject(MAT_DIALOG_DATA) public data: any, // DialogData,
  ) {

    this.favEntities = this.data.favEntities;

    this.baseItems$ = this.baseSrv.getAllItemsBase(BaseType.ENTITY);

    this.baseItemSelected = data.entity; // this.SECTION_BLANK;
    this.baseItemName = 'entidad';
    this.baseItemDesc = 'rol';

    this.baseItemForm = this.fb.group({
      // control:new FormControl('',Validators.required),
      entityOption: ['1', []],
      baseItem: [ this.baseItemSelected, []],
      baseItemDesc: [ '', []],
    });
  }

  onSelectionChanged(event: any): void {
    this.baseItemSelected = event.value;
    this.baseItemForm.controls.baseItemDesc.setValue(this.baseItemSelected.description);
  }

  compareFunction(o1: IBase, o2: IBase): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    const result: [string, IBase] = [this.baseItemForm.controls.entityOption.value, this.baseItemSelected];
    this.dialogRef.close(result);
  }
}