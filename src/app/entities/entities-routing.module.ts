import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntitiesComponent } from './entities.component';
import { EntityViewComponent } from './entity-view/entity-view.component';
import { EntityEditComponent } from './entity-edit/entity-edit.component';

const routes: Routes = [
  {
    path: '',
    component: EntitiesComponent
  },
  {
    path: ':id',
    component: EntityViewComponent,
  },
  {
    path: ':id/editar',
    component: EntityEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
