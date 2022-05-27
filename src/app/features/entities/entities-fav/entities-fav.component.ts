/* eslint-disable max-len */
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IEntity } from '@models/entity';
import { IUser } from '@models/user';
import { EntityService } from '@services/entities.service';
import { PictureService } from '@services/pictures.service';
import { LogService } from '@services/log.service';
import { SpinnerService } from '@services/spinner.service';
import { UserService } from '@services/users.service';

@Component({
  selector: 'app-entities-fav',
  templateUrl: './entities-fav.component.html',
  styleUrls: ['./entities-fav.component.scss']
})
export class EntitiesFavComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public viewMode = 'cards';
  public loading = true;
  public entities: IEntity[];
  public ENTITIES_BACKUP: IEntity[];
  public dataSource: MatTableDataSource<IEntity> = new MatTableDataSource();
  displayedColumns: string[] = [ 'roleDefault', 'id', 'image', 'collapsed-info', 'name', 'categories', 'placeImage', 'placeName', 'actions3'];
  private userLogged: IUser;
  private favEntities: string[];
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    public auth: AngularFireAuth,
    private logSrv: LogService,
    private entitySrv: EntityService,
    private pictureSrv: PictureService,
    private spinnerSvc: SpinnerService,
    private userSrv: UserService,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const subs1$ = this.auth.user.subscribe((usr) => {
      const uidUser = usr.uid;
      this.userSrv.getOneUser(uidUser)
      .subscribe( (user: IUser) => {
        this.userLogged = user;
        this.favEntities = this.userLogged.favEntities;
      });
    });



    const subs2$ = this.entitySrv.getAllEntities()
    .pipe(
      map(entities => entities.map(entity => {
        const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;

        entity.description = entity.categories.reduce(reducer, '');
        return { ...entity };
      }))
    )
    .subscribe( (entities: IEntity[]) => {
      this.entities = entities;
      this.ENTITIES_BACKUP = entities;
      this.dataSource = new MatTableDataSource(this.entities);
      this.spinnerSvc.hide();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.listOfObservers.push(subs1$);
    this.listOfObservers.push(subs2$);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getThumbnail(image: string): string {
    return this.pictureSrv.getThumbnail(image);
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
        Swal.fire({
          title: '¡Borrado!',
          text: `${entity.name} ha sido borrado`,
          icon: 'success',
          confirmButtonColor: '#003A59',
        });
      }
    });
  }

  public addItem(): void {
    this.router.navigate([`entidades/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  setOptionsMode(optionsMode: boolean[]): void {
    // console.log(`Ver solo Activos: ${optionsMode[0]}`);
    // console.log(`Ver Solo Favoritos: ${optionsMode[1]}`);

    if ( !optionsMode[1] ) {
        this.entities = this.ENTITIES_BACKUP.filter(entity => {
          console.log(`${this.favEntities} -> ${entity.id}`);
          return this.favEntities.includes(entity.id);
      });
    } else {
      this.entities = this.ENTITIES_BACKUP;
    }

    this.dataSource = new MatTableDataSource(this.entities);
  }
}

