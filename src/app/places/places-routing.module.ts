import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesComponent } from '@app/places/places.component';
import { PlaceViewComponent } from '@app/places/place-view/place-view.component';
import { PlaceEditComponent } from '@app/places/place-edit/place-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PlacesComponent
  },
  {
    path: ':id',
    component: PlaceViewComponent,
  },
  {
    path: ':id/editar',
    component: PlaceEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesRoutingModule { }
