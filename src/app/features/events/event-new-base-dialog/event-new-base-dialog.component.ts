import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { IBase, Base, BaseType } from '@models/base';
import { UtilsService, SwalMessage } from '@services/utils.service';
import { BaseService } from '@services/base.service';

@Component({
  selector: 'app-event-new-base-dialog',
  templateUrl: './event-new-base-dialog.component.html',
})
export class EventNewBaseDialogComponent implements OnInit {

  readonly SECTION_BLANK: Base = Base.InitDefault();
  title: string;
  baseItemName: string;
  baseItemDesc: string;
  baseItemForm: FormGroup;
  baseItemCtrl = new FormControl();
  baseItemSelected: IBase;
  baseItems$: Observable<IBase[]>;

  constructor(
    private fb: FormBuilder,
    private utilsSrv: UtilsService,
    private baseSrv: BaseService,
    public dialogRef: MatDialogRef<EventNewBaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BaseType) {
  }

  ngOnInit(): void {

    switch (this.data) {
      case BaseType.PLACE:
        this.title = 'Selecciona una ubicación asociada a este evento';
        this.baseItems$ = this.baseSrv.getAllItemsBase(BaseType.PLACE);
        this.baseItemName = 'ubicación';
        this.baseItemDesc = 'descripción';
        break;

      case BaseType.ENTITY:
        this.title = 'Selecciona una entidad asociada a este evento';
        this.baseItems$ = this.baseSrv.getAllItemsBase(BaseType.ENTITY);
        this.baseItemName = 'entidad';
        this.baseItemDesc = 'rol';
        break;

      default:
        break;
    }

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
    this.utilsSrv.swalFire(SwalMessage.NO_CHANGES);
    this.dialogRef.close();
  }

  save(): void {

    const newBase: IBase = this.baseItemForm.value.baseItem;
    if ( newBase.id === this.SECTION_BLANK.id ) {
      return this.onNoClick();
    } else {
      newBase.baseType = this.data;
      newBase.description = this.baseItemForm.controls.baseItemDesc.value;

      this.dialogRef.close(newBase);
      this.utilsSrv.swalFire(SwalMessage.OK_CHANGES, this.baseItemName);
    }
  }
}
