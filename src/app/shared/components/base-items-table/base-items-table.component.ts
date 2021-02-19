import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { LogService } from '@services/log.service';
import { IBase } from '@models/base';

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
  @Input() baseItems: IBase[];
  public baseItemsLength: string;

  displayedColumns: string[] = ['baseId', 'baseImage', 'baseName', 'baseDesc', 'active', 'baseActions4' ];
  public dataSource: MatTableDataSource<IBase> = new MatTableDataSource();

  constructor(
    private logSrv: LogService,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.baseItems);
    this.baseItemsLength = this.baseItems.length.toString();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.dataSource = new MatTableDataSource(this.baseItems);
    this.baseItemsLength = this.baseItems.length.toString();
    // this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  changeOrderElement(base: IBase, change: string): void {
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

  editElement(base: IBase): void {
    this.logSrv.info(`editBase: ${JSON.stringify(base)}`);
    this.editBase.emit(base);
  }
}
