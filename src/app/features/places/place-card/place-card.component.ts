import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { IPlace, Place } from '@models/place';
import { PictureService } from '@services/pictures.service';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html'
})
export class PlaceCardComponent implements OnInit {

  @Input() place: IPlace;

  constructor(
    private pictureSrv: PictureService,
    private spinnerSvc: SpinnerService,
    private router: Router,
  ) {
    this.spinnerSvc.show();
  }

  ngOnInit(): void {

    const reducer = (acc, value) => `${acc} ${value.substr(0, value.indexOf(' '))}`;
    this.place.extra = ( this.place.categories ) ? this.place.categories.reduce(reducer, '') : '';

    this.spinnerSvc.hide();
  }

  getMediumImage(image: string): string {
    return this.pictureSrv.getMediumImage(image);
  }

  gotoItem(): void {
    this.router.navigate([`/${Place.PATH_URL}/${this.place.id}`]);
  }
}
