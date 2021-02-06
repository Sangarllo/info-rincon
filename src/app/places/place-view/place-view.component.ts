import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { PlaceService } from '@services/places.service';
import { IPlace, Place } from '@shared/models/place';

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
    private placeSrv: PlaceService,
  ) { }

  ngOnInit(): void {
    this.idPlace = this.route.snapshot.paramMap.get('id');
    if ( this.idPlace ) {
      console.log(`id asked ${this.idPlace}`);
      this.getDetails(this.idPlace);
    }
  }

  getDetails(idPlace: string): void {
    console.log(`id asked ${idPlace}`);
    this.place$ = this.placeSrv.getOnePlace(idPlace);
  }

  public gotoList(): void {
    this.router.navigate([`/${Place.PATH_URL}`]);
  }

  public editItem(): void {
    this.router.navigate([`/${Place.PATH_URL}/${this.idPlace}/editar`]);
  }


}
