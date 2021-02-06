import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { IEntity, Entity } from '@models/entity';

@Component({
  selector: 'app-user-entities',
  templateUrl: './user-entities.component.html',
  styleUrls: ['./user-entities.component.scss']
})
export class UserEntitiesComponent implements OnInit, AfterViewInit {

  @Input() entities: IEntity[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<IEntity>;

  displayedColumns: string[] = [ 'image', 'id', 'name'];

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.entities);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public gotoEntity(entity: IEntity): void {
    this.router.navigate([`${Entity.PATH_URL}/${entity.id}`]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
