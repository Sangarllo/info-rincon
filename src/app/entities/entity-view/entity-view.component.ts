import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SeoService } from '@services/seo.service';
import { EntityService } from '@services/entities.service';
import { IEntity, Entity } from '@models/entity';

@Component({
  selector: 'app-entity-view',
  templateUrl: './entity-view.component.html',
  styleUrls: ['./entity-view.component.scss']
})
export class EntityViewComponent implements OnInit {

  public entity$: Observable<IEntity | undefined> | null = null;
  public idEntity: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private entitiesSrv: EntityService,
  ) { }

  ngOnInit(): void {
    this.idEntity = this.route.snapshot.paramMap.get('id');
    if ( this.idEntity ) {
      this.getDetails(this.idEntity);
    }
  }

  getDetails(idEntity: string): void {
    this.entity$ = this.entitiesSrv.getOneEntity(idEntity)
      .pipe(
        tap(entity =>
          this.seo.generateTags({
            title: `${entity.name} | Entidad de Rincón de Soto`,
            description: entity.description,
            image: entity.image,
          })
        )
      );
  }

  public gotoList(): void {
    this.router.navigate([`/${Entity.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Entity.PATH_URL}/${this.idEntity}/editar`]);
  }
}
