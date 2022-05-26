import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IEntity, Entity } from '@models/entity';
import { PictureService } from '@services/pictures.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-entity-card',
  templateUrl: './entity-card.component.html'
})
export class EntityCardComponent implements OnInit {

  @Input() entity: IEntity;

  constructor(
    private pictureSrv: PictureService,
    private spinnerSvc: SpinnerService,
    private router: Router,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;
    this.entity.extra = ( this.entity.categories ) ? this.entity.categories.reduce(reducer, '') : '';

    this.spinnerSvc.hide();
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  gotoItem(): void {
    this.router.navigate([`/${Entity.PATH_URL}/${this.entity.id}`]);
  }
}
