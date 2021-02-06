import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserService } from '@services/users.service';
import { EntityService } from '@services/entities.service';
import { IUser } from '@models/user';
import { IEntity } from '@models/entity';

@Component({
  selector: 'app-user-admin-entities',
  templateUrl: './user-admin-entities.component.html',
  styleUrls: ['./user-admin-entities.component.scss']
})
export class UserAdminEntitiesComponent implements OnInit {

  public pageTitle = 'Administración de entides del nuevo usuario';
  public user: IUser;
  public filteredEntities: Observable<IEntity[]>;

  entities: IEntity[];
  entityCtrl = new FormControl();
  entityForm!: FormGroup;
  selectedEntity: IEntity;

  displayedColumns: string[] = [ 'image', 'id', 'name', 'actions3' ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSrv: UserService,
    private entitySrv: EntityService,
  ) {
    this.entitySrv.getAllEntities().subscribe(
      (entities: IEntity[]) => {
        this.entities = entities;
        this.filteredEntities = this.entityCtrl.valueChanges
        .pipe(
          startWith(''),
          map(entity => entity ? this._filterEntities(entity) : this.entities.slice())
        );
      }
    );
  }

  ngOnInit(): void {
    const uidUser = this.route.snapshot.paramMap.get('uid');
    if ( uidUser ) {
      console.log(`uid asked ${uidUser}`);
      this.getDetails(uidUser);
    }
  }

  public getDetails(uidUser: string): void {
      this.userSrv.getOneUser(uidUser)
        .subscribe( (user: IUser) => {
          this.user = user;
          this.pageTitle = `Administración de entidades de ${this.user.displayName}`;
          // this.user.entitiesAdmin = this.user.entitiesAdmin ?? [];
      });
  }

  public onSelectedOption(entity: IEntity): void {
    this.selectedEntity = entity;
    console.log(`onSelectedOption: ${JSON.stringify(entity)}`);
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

  public addUserEntity(): void {

    const filter = this.user.entitiesAdmin.filter( entity => entity.id === this.selectedEntity.id );

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

  private _filterEntities(value: string): IEntity[] {
    const filterValue = value.toLowerCase();

    return this.entities.filter(entity => entity.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
