/* eslint-disable max-len */
import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { SwalMessage, UtilsService } from '@services/utils.service';

import { LogService } from '@services/log.service';
import { BaseType, IBase } from '@models/base';

@Component({
  selector: 'sh-base-items-table',
  templateUrl: './base-items-table.component.html',
  styleUrls: ['./base-items-table.component.scss']
})
export class BaseItemsTableComponent implements OnInit, OnChanges {

  @Output() changeOrderBase = new EventEmitter<IBase>();
  @Output() addBase = new EventEmitter<IBase>();
  @Output() deleteBase = new EventEmitter<IBase>();
  @Output() editBase = new EventEmitter<IBase>();
  @Output() deleteForeverBase = new EventEmitter<IBase>();
  @Input() baseItems: IBase[];
  @Input() baseType: BaseType;
  @Input() modeAdmin: boolean;
  public baseItemsLength: number;

  displayedColumns: string[];
  public dataSource: MatTableDataSource<IBase> = new MatTableDataSource();

  constructor(
    private logSrv: LogService,
    private utilsSvc: UtilsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.baseItems);
    this.baseItemsLength = this.baseItems.length;
    switch(this.baseType) {

      case BaseType.EVENT:
        if ( this.modeAdmin ) {
          // eslint-disable-next-line max-len
          this.displayedColumns = ['baseId', 'baseSmallImage', 'baseBigName', 'placeSmallImage', 'baseDescHorario',  'baseActions5', 'collapsed-info' ]; // 'active',
        } else {
          this.displayedColumns = ['baseSmallImage', 'baseBigName', 'baseTimestamp', 'status', 'baseActions1', 'collapsed-info' ];
        }

        break;

      case BaseType.AUDIT:
        this.displayedColumns = ['baseSmallImage', 'baseTimestamp', 'baseDesc', 'collapsed-info' ];
        break;

      case BaseType.ENTITY:
        this.displayedColumns = [ 'baseSmallImage', 'baseBigName', 'collapsed-info' ];
        break;

      case BaseType.LINK:
        this.displayedColumns = [ 'baseSmallImage', 'baseLink' ];
        break;

    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.dataSource = new MatTableDataSource(this.baseItems);
    this.baseItemsLength = this.baseItems.length;
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  changeOrderElement(base: IBase, change: number): void {
    base.id = `${base.id}|${change}`;
    this.logSrv.info(`changeOrderBase: ${JSON.stringify(base)}`);
    this.changeOrderBase.emit(base);
  }

  addElement(base: IBase): void {
    this.logSrv.info(`addBase: ${JSON.stringify(base)}`);
    this.addBase.emit(base);
  }

  deleteElement(base: IBase): void {
    this.logSrv.info(`deleteBase: ${JSON.stringify(base)}`);
    this.deleteBase.emit(base);
  }

  deleteForeverElement(base: IBase): void {
    this.logSrv.info(`deleteForeverElement: ${JSON.stringify(base)}`);
    this.deleteForeverBase.emit(base);
  }

  editElement(base: IBase): void {
    console.log(`editBase: ${JSON.stringify(base)}`);
    //this.logSrv.info(`editBase: ${JSON.stringify(base)}`);
    this.editBase.emit(base);
  }

  gotoElement(base: IBase): void {
    this.router.navigate([`eventos/${base.id}`]);
  }

  previewItem(base: IBase): void {
    this.utilsSvc.swalFire(SwalMessage.GOTO_URL, '', base);
  }
}
