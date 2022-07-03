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
  selector: 'app-entities-own',
  templateUrl: './entities-own.component.html',
  styleUrls: ['./entities-own.component.scss']
})
export class EntitiesOwnComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public loading = true;
  public entities: IEntity[];
  public ENTITIES_BACKUP: IEntity[];
  public dataSource: MatTableDataSource<IEntity> = new MatTableDataSource();
  private userLogged: IUser;
  private listOfObservers: Array<Subscription> = [];

  constructor(
    private router: Router,
    public auth: AngularFireAuth,
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
        this.entities = this.userLogged.entitiesAdmin;
        this.ENTITIES_BACKUP = this.entities;
        this.dataSource = new MatTableDataSource(this.entities);
        this.spinnerSvc.hide();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });

    this.listOfObservers.push(subs1$);
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

  public addItem(): void {
    this.router.navigate([`entidades/0/editar`]);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }

  setOptionsMode(optionsMode: boolean[]): void {
    // console.log(`Ver solo Activos: ${optionsMode[0]}`);
    // console.log(`Ver Solo Favoritos: ${optionsMode[1]}`);

    if ( !optionsMode[1] ) {
        this.entities = this.ENTITIES_BACKUP.filter(entity => {
          console.log(`${this.entities} -> ${entity.id}`);
          return this.entities.includes(entity);
      });
    } else {
      this.entities = this.ENTITIES_BACKUP;
    }

    this.dataSource = new MatTableDataSource(this.entities);
  }
}

