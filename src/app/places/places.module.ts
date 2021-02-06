import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from '@app/places/places-routing.module';
import { PlacesComponent } from '@app/places/places.component';
import { PlaceViewComponent } from '@app/places/place-view/place-view.component';
import { PlaceEditComponent } from '@app/places/place-edit/place-edit.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    PlacesComponent,
    PlaceViewComponent,
    PlaceEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlacesRoutingModule
  ]
})
export class PlacesModule { }
