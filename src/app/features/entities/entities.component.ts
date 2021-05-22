/* eslint-disable max-len */
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IEntity } from '@models/entity';
import { EntityService } from '@services/entities.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  private listOfObservers: Array<Subscription> = [];
  public loading = true;
  public entities: IEntity[];
  public dataSource: MatTableDataSource<IEntity> = new MatTableDataSource();
  displayedColumns: string[] = [ 'roleDefault', 'id', 'image', 'collapsed-info', 'name', 'categories', 'placeImage', 'placeName', 'actions3'];

  constructor(
    private router: Router,
    private logSrv: LogService,
    private entitySrv: EntityService,
    private spinnerSvc: SpinnerService
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {
    const subs1$ = this.entitySrv.getAllEntities()
    .pipe(
      map(entities => entities.map(entity => {
        const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

        entity.description = entity.categories.reduce(reducer, '');
        return { ...entity };
      }))
    )
    .subscribe( (entities: IEntity[]) => {
      this.entities = entities;
      this.dataSource = new MatTableDataSource(this.entities);
      this.spinnerSvc.hide();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.listOfObservers.push(subs1$);
  }

    applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public gotoItem(entity: IEntity): void {
    this.router.navigate([`entidades/${entity.id}`]);
  }

  public editEntity(entity: IEntity): void {
    this.router.navigate([`entidades/${entity.id}/editar`]);
  }

  public deleteEntity(entity: IEntity): void {
    this.logSrv.info(`Borrando ${entity.id}`);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción de borrado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entitySrv.deleteEntity(entity);
        Swal.fire(
          '¡Borrado!',
          `${entity.name} ha sido borrado`,
          'success'
        );
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`entidades/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}

