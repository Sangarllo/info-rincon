import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { CalendarView } from 'angular-calendar';

import { IBase, Base, BaseType } from '@models/base';
import { BaseService } from '@services/base.service';

@Component({
  selector: 'app-calendar-mode-dialog',
  templateUrl: './calendar-mode-dialog.component.html',
  styleUrls: ['./calendar-mode-dialog.component.scss']
})
export class CalendarModeDialogComponent {

  readonly SECTION_BLANK: Base = Base.InitDefault();
  baseItemName: string;
  baseItemDesc: string;
  baseItemForm: FormGroup;
  baseItemCtrl = new FormControl();
  baseItemSelected: IBase;
  baseItems$: Observable<IBase[]>;

  CalendarView = CalendarView;
  public modeSelected: string;
  view: CalendarView;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CalendarModeDialogComponent>,
    private baseSrv: BaseService,
    @Inject(MAT_DIALOG_DATA) public data: any, // DialogData,
  ) {
    console.log(`opening ${JSON.stringify(data)}`);
    this.modeSelected = this.data.view;
    console.log(`modeSelected ${JSON.stringify(this.view)}`);

    this.baseItems$ = this.baseSrv.getAllItemsBase(BaseType.ENTITY);
    this.baseItemName = 'entidad';
    this.baseItemDesc = 'rol';

    this.baseItemSelected = this.SECTION_BLANK;

    this.baseItemForm = this.fb.group({
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
    const result: [string, IBase] = [this.modeSelected, this.baseItemSelected];
    console.log(`returnData1: ${JSON.stringify(result)}`);
    this.dialogRef.close(result);
  }
}
