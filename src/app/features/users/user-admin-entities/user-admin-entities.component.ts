import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IUser } from '@models/user';
import { IEntity } from '@models/entity';
import { UserService } from '@services/users.service';
import { EntityService } from '@services/entities.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-user-admin-entities',
  templateUrl: './user-admin-entities.component.html',
  styleUrls: ['./user-admin-entities.component.scss']
})
export class UserAdminEntitiesComponent implements OnInit, OnDestroy {

  private listOfObservers: Array<Subscription> = [];
  public pageTitle = 'Administración de entides del nuevo usuario';
  public user: IUser;
  public filteredEntities: Observable<IEntity[]>;

  entities: IEntity[];
  entityCtrl = new FormControl();
  entityForm!: FormGroup;
  selectedEntity: IEntity;

  displayedColumns: string[] = [ 'image', 'name', 'actions3' ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logSrv: LogService,
    private userSrv: UserService,
    private entitySrv: EntityService,
  ) {
    const subs1$ = this.entitySrv.getAllEntities()
      .subscribe(
        (entities: IEntity[]) => {
          this.entities = entities;
          this.filteredEntities = this.entityCtrl.valueChanges
          .pipe(
            startWith(''),
            map(entity => entity ? this.filterEntities(entity) : this.entities.slice())
          );
        }
      );

    this.listOfObservers.push(subs1$);
  }

  ngOnInit(): void {
    const uidUser = this.route.snapshot.paramMap.get('uid');
    if ( uidUser ) {
      this.logSrv.info(`uid asked ${uidUser}`);
      this.getDetails(uidUser);
    }
  }

  public getDetails(uidUser: string): void {

    const subs2$ = this.userSrv.getOneUser(uidUser)
        .subscribe( (user: IUser) => {
          this.user = user;
          this.pageTitle = `Administración de entidades de ${this.user.displayName}`;
          this.logSrv.info(`title: ${this.pageTitle}`);
          this.user.entitiesAdmin = this.user.entitiesAdmin ?? [];
      });

    this.listOfObservers.push(subs2$);
  }

  public onSelectedOption(entity: IEntity): void {
    this.selectedEntity = entity;
    this.logSrv.info(`onSelectedOption: ${JSON.stringify(entity)}`);
  }

  public gotoEntity(entity: IEntity): void {
    this.router.navigate([`entidades/${entity.id}`]);
  }

  public deleteUserEntity(deletedEntity: IEntity): void {

    this.user.entitiesAdmin = this.user.entitiesAdmin.filter( entity => entity.id !== deletedEntity.id );

    this.userSrv.updateUser(this.user);

    Swal.fire({
        icon: 'success',
        title: 'Datos guardados con éxito',
        text: `${this.user.displayName} ya no gestiona la entidad ${deletedEntity.name}`,
    });
  }

  public setAsEntityDefault(entity: IEntity): void {
    this.user.entityDefault = entity;

    this.userSrv.updateUser(this.user);

    Swal.fire({
        icon: 'success',
        title: 'Datos guardados con éxito',
        text: `${this.user.displayName} administra pr defecto ${entity.name}`,
    });
  }

  public addUserEntity(): void {

    const filter = this.user.entitiesAdmin?.filter( entity => entity.id === this.selectedEntity.id );

    if ( filter.length === 0 ) {
      this.user.entitiesAdmin.push(this.selectedEntity);
      this.userSrv.updateUser(this.user);
      Swal.fire({
        icon: 'success',
        title: 'Datos guardados con éxito',
        text: `${this.user.displayName} ya puede gestionar la entidad ${this.selectedEntity.name}`,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No ha sido posible',
        text: `${this.user.displayName} ya podía gestionar la entidad ${this.selectedEntity.name}`,
        footer: '<i>En caso de dudas, consulta con el administrador</>'
      });
    }

    this.selectedEntity = undefined;
  }

  public cancel(): void {
    this.selectedEntity = undefined;
  }

  private filterEntities(value: string): IEntity[] {
    const filterValue = value.toLowerCase();

    return this.entities.filter(entity => entity.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.listOfObservers.forEach(sub => sub.unsubscribe());
  }
}
