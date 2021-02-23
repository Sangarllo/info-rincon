import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Entity, IEntity } from '@models/entity';
import { EVENT_CATEGORIES, Category } from '@models/category.enum';
import { Base } from '@models/base';
import { EntityRole } from '@models/entity-role.enum';
import { ScheduleType, SCHEDULE_TYPES } from '@models/shedule-type.enum';
import { EntityService } from '@services/entities.service';
import { PlaceService } from '@services/places.service';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent implements OnInit {

  entityForm!: FormGroup;
  pageTitle = 'Creación de una nueva entidad';
  errorMessage = '';
  uploadPercent: Observable<number>;

  public entity!: IEntity | undefined;
  public CATEGORIES: Category[] = EVENT_CATEGORIES;
  public ROLES: EntityRole[] = Entity.ROLES;
  public SCHEDULE_TYPES: ScheduleType[] = SCHEDULE_TYPES;

  placeBaseSelected: Base;
  readonly SECTION_BLANK: Base = Base.InitDefault();
  places$: Observable<Base[]>;

  constructor(
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logSrv: LogService,
    private entitiesSrv: EntityService,
    private placeSrv: PlaceService) { }

  ngOnInit(): void {

    const idEntity = this.route.snapshot.paramMap.get('id');
    if ( idEntity ) {
      this.getDetails(idEntity);

      this.entityForm = this.fb.group({
        id: [{value: '0', disabled: true}],
        active: true,
        name: ['', [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)]],
        image: Entity.IMAGE_DEFAULT,
        categories: [],
        place: [this.SECTION_BLANK, [Validators.required]],
        roleDefault: [EntityRole.Default],
        scheduleTypeDefault: [''],
      });

      this.places$ = this.placeSrv.getAllPlacesBase();
    }
  }

  getDetails(idEntity: string): void {

    if ( idEntity === '0' ) {
      this.pageTitle = 'Creación de una nueva entidad';
      this.entity = Entity.InitDefault();
    } else {
      this.entitiesSrv.getOneEntity(idEntity)
      .subscribe({
        next: (entity: IEntity | undefined) => {
          this.entity = entity;
          this.displayEntity();
          this.logSrv.info(JSON.stringify(this.entity));
        },
        error: err => {
          this.errorMessage = `Error: ${err}`;
        }
      });
    }
  }


  displayEntity(): void {

    if (this.entityForm) {
      this.entityForm.reset();
    }

    if (this.entity.id === '0') {
      this.pageTitle = 'Creando una nueva entidad';
    } else {
      this.pageTitle = `Editando la entidad ${this.entity.name}`;
    }

    // Update the data on the form
    this.entityForm.patchValue({
      id: this.entity.id,
      active: this.entity.active,
      name: this.entity.name,
      image: this.entity.image ?? Entity.IMAGE_DEFAULT,
      categories: this.entity.categories ?? [],
      place: ( this.entity.place ) ? {
        id: this.entity.place.id,
        name: this.entity.place.name,
        image: this.entity.place.image
      } : this.SECTION_BLANK,
      roleDefault: this.entity.roleDefault,
      scheduleTypeDefault: this.entity.scheduleTypeDefault,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.entityForm.controls['id'].setValue(this.entity.id);
  }

  onSelectionChanged(event: any): void {
    this.placeBaseSelected = event.value;
  }

  compareFunction(o1: any, o2: any): boolean {
    return (o1.name === o2.name && o1.id === o2.id);
  }

  onResetForm(): void {
    this.entityForm.reset();
  }

  onSaveForm(): void {
    if (this.entityForm.valid) {

        const entityItem = { ...this.entity, ...this.entityForm.value };
        if ( this.compareFunction( entityItem.place, this.SECTION_BLANK ) ) {
          this.logSrv.info(`No hay lugar`);
          entityItem.place = null;
        }

        if (entityItem.id === '0') {
          this.entitiesSrv.addEntity(entityItem);
        } else {
          this.entitiesSrv.updateEntity(entityItem);
        }

        this.router.navigate([ Entity.PATH_URL]);

    } else {
      this.errorMessage = 'Por favor, corrige los mensajes de validación.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.entityForm.reset();
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados con éxito',
      text: `Los datos de ${this.entity.name} se han guardado correctamente`,
      // footer: '<a href>Why do I have this issue?</a>'
    });
    this.router.navigate([`/${Entity.PATH_URL}`]);
  }

  gotoList(): void {
    this.entityForm.reset();
    this.router.navigate([`/${Entity.PATH_URL}`]);
  }

  uploadImage(event): void {
    const file = event.target.files[0];
    const filePath = file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            ( imageUrl: string ) => {

              this.entity.image = imageUrl;

              // Update the data on the form
              this.entityForm.patchValue({
                image: this.entity.image
              });
          });
        })
     )
    .subscribe();
  }
}
