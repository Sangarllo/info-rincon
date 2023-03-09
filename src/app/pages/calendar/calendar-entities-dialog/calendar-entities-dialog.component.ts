import { Component, Inject } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { IEntity } from '@models/entity';
import { BaseService } from '@services/base.service';
import { EntityService } from '@services/entities.service';

@Component({
  selector: 'app-calendar-entities-dialog',
  templateUrl: './calendar-entities-dialog.component.html',
  styleUrls: ['./calendar-entities-dialog.component.scss']
})
export class CalendarEntitiesDialogComponent {

  readonly SECTION_BLANK: Base = Base.InitDefault();
  baseItemName: string;
  baseItemDesc: string;
  baseItemForm: UntypedFormGroup;
  baseItemCtrl = new UntypedFormControl();
  baseItemSelected: IBase;
  baseItems$: Observable<IBase[]>;
  favEntitiesStr: string[] = [];
  favEntities$: Observable<IEntity[]>;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CalendarEntitiesDialogComponent>,
    private baseSrv: BaseService,
    private entitySrv: EntityService,
    @Inject(MAT_DIALOG_DATA) public data: any, // DialogData,
  ) {

    this.favEntitiesStr = this.data.favEntities;
    if ( this.favEntitiesStr?.length > 0 ) {
      this.favEntities$ = this.entitySrv.getSeveralEntities(this.favEntitiesStr);
    };

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
    console.log(`onSelectionChanged: ${this.baseItemSelected}`);
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
