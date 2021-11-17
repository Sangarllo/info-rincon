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
    switch ( data.view ) {
      case 'day':
          this.modeSelected = 'CalendarView.Day';
          break;
      case 'week':
          this.modeSelected = 'CalendarView.Week';
          break;
      case 'month':
      default:
          this.modeSelected = 'CalendarView.Month';
          break;
    }

    this.baseItems$ = this.baseSrv.getAllItemsBase(BaseType.ENTITY);

    console.log(`configuring... data.entityId: ${data.entityId}`);
    this.baseItemSelected = this.SECTION_BLANK;
    this.baseItemName = 'entidad';
    this.baseItemDesc = 'rol';

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
    this.dialogRef.close(result);
  }
}
