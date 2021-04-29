import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SeoService } from '@services/seo.service';
import { PlaceService } from '@services/places.service';
import { LogService } from '@services/log.service';
import { IPlace, Place } from 'src/app/core/models/place';

@Component({
  selector: 'app-place-view',
  templateUrl: './place-view.component.html',
  styleUrls: ['./place-view.component.scss']
})
export class PlaceViewComponent implements OnInit {

  public place$: Observable<IPlace | undefined> | null = null;
  public idPlace: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private logSrv: LogService,
    private placeSrv: PlaceService,
  ) { }

  ngOnInit(): void {
    this.idPlace = this.route.snapshot.paramMap.get('id');
    if ( this.idPlace ) {
      this.logSrv.info(`id asked ${this.idPlace}`);
      this.getDetails(this.idPlace);
    }
  }

  getDetails(idPlace: string): void {
    this.logSrv.info(`id asked ${idPlace}`);
    this.place$ = this.placeSrv.getOnePlace(idPlace)
      .pipe(
        tap(place =>
          this.seo.generateTags({
            title: `${place.name} | Lugar de Rincón de Soto`,
            description: place.description,
            image: place.image,
          })
        )
      );
  }

  public gotoList(): void {
    this.router.navigate([`/${Place.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Place.PATH_URL}/${this.idPlace}/editar`]);
  }


}
