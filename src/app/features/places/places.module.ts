import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlacesRoutingModule } from '@features/places/places-routing.module';
import { PlacesComponent } from '@features/places/places.component';
import { PlaceViewComponent } from '@features/places/place-view/place-view.component';
import { PlaceEditComponent } from '@features/places/place-edit/place-edit.component';
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
