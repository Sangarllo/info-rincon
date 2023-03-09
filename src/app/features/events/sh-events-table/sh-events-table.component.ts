/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { IEvent } from '@models/event';
import { UserService } from '@services/users.service';
import { IBase } from '@models/base';

@Component({
  selector: 'sh-events-table',
  templateUrl: './sh-events-table.component.html',
  styleUrls: ['./sh-events-table.component.scss']
})
export class ShEventsTableComponent implements OnInit, OnDestroy {

  @Input() set events(value: IEvent[]) {
    // console.log(value);
    this.dataSource = new MatTableDataSource<IEvent>(value);
  };
  dataSource: MatTableDataSource<IEvent> ;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Input() viewMode: string;
  @Input() title: string;
  @Input() displayedColumns: string[];
  @Input() addEvent = false;
  @Output() deleteEvent = new EventEmitter<IEvent>();
  @Output() deleteForeverEvent = new EventEmitter<IEvent>();
  @Output() removeFavEvent = new EventEmitter<IEvent>();
  @Output() setMainBase = new EventEmitter<{event: IEvent; base: IBase; main: boolean}>();

  constructor(
    private router: Router,
    private userSrv: UserService,
  ) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public addItem(): void {
    this.router.navigate([`eventos/0/editar`]);
  }

  public gotoItem(event: IEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  public gotoEntitiesFav(): void {
    this.router.navigate([`entidades/favoritas`]);
  }

  ngOnDestroy(): void {
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  deleteItem(item: IEvent): void {
    this.deleteEvent.emit(item);
  }

  deleteForeverItem(item: IEvent): void {
    this.deleteForeverEvent.emit(item);
  }

  // removeFav should be "deleteItem" (in favs)
  removeFav(item: IEvent): void {
    this.removeFavEvent.emit(item);
  }

  setMain(event: IEvent, base: IBase, main: boolean): void {
    console.log(`setMain: | ${event.name} | ${base.name} | main: ${main}`);
    this.setMainBase.emit({event, base, main});
  }
}
