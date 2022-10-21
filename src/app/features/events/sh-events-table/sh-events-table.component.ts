/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { IEvent } from '@models/event';
import { IUser } from '@models/user';
import { UserService } from '@services/users.service';

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
  @Input() userLogged: IUser;

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

  public gotoItem(event: IEvent): void {
    this.router.navigate([`eventos/${event.id}`]);
  }

  public gotoEntitiesFav(): void {
    this.router.navigate([`entidades/favoritas`]);
  }

  public removeFav(event: IEvent): void {
    this.userLogged.favEvents = this.userLogged.favEvents.filter( (eventId: string) => eventId !== event.id );
    this.userSrv.updateUser(this.userLogged);
  }

  ngOnDestroy(): void {
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
